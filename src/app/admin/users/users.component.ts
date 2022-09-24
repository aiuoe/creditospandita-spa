import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RolesService } from 'app/shared/services/roles.service';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { UsersService } from 'app/shared/services/users.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { MustMatch } from '../../_helpers/must-match.validator';
import { AuthService } from '../../shared/auth/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  formUser: FormGroup;
  roles$: Observable<any[]>;
  page=1;
  per_page=30;
  submitted = false;
  userToEdit$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private fb: FormBuilder,
    private rolesService: RolesService,
    private userService: UsersService,
    private toast: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private auth : AuthService,
  ) {
    this.formUser = this.fb.group({
      id: [''],

     
      roles: ['2'],
   
      password:['', 
      [
        Validators.required, 
        Validators.pattern(
          new RegExp(
            /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9$@$!%*?&]+)$/
          )
        )
        
      ]
    ],
    confirmation_password:['', [Validators.required]],
    

    },
    {
      validator: MustMatch('password', 'confirmation_password')
    });

    this.roles$ = this.rolesService.get();

    this.activatedRoute.params
      .pipe(
        switchMap(params => {
          if (params['id']) {
            return this.userService.show(params['id']);
          } else {
            return of(null);
          }
        })
      )
      .subscribe(user => {
        if (user) {
          this.userToEdit$.next(user);
          this.formUser.controls['id'].setValue(user['id']);

          // this.formUser.controls['password'].setValue(user['password']);
          this.formUser.controls['roles'].setValue(
            user['roles'].map(rol => rol['id'])
          );
        
        }
      });
  }

  add() {
    // if (this.formUser.valid) {
      this.submitted = true;
      this.userService.add(this.formUser.value).subscribe(response => {
        if (response) {
          this.toast.success(response['message']);
          this.router.navigate(['/admin/users/list']);
        } else {
          this.toast.error(JSON.stringify(response));
        }
      },(error)=>
      {
        let mensaje =error.error.errors;
        Object.keys(mensaje).forEach(key => {
          console.log(key)
          this.toast.error(mensaje[key][0]);
          console.log(mensaje[key][0])
         });
      });
    // }
  }

  edit() {
         this.submitted = true;
         console.log("clave",this.formUser.value)
    if (this.formUser.valid) {
      const id = this.formUser.controls['id'].value;
      this.userService.update(id, this.formUser.value).subscribe(response => {
        if (response) {
          console.log(response);
          let user = JSON.parse(JSON.stringify(response)).data
          this.toast.success(response['message']);
          if(this.auth.isAdmin()){
            if(user.roles[0].name == "Administrador"){
              this.router.navigate(['/admin/users/list-admin']);
              console.log("admin")
            }else{
              this.router.navigate(['/admin/users/list']);
            }
            
          }else{
            this.router.navigate(['/home']);
          }
          
        } else {
          this.toast.error(JSON.stringify(response));
        }
      });
    }
    // console.log(this.formUser.value);
  }

  ngOnInit() {}

  get f() { return this.formUser.controls; }
}
