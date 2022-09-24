import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { registerLocaleData, formatNumber } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { RequestService } from 'app/shared/services/request.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, from, BehaviorSubject, of } from 'rxjs';
import { MustMatch } from '../../_helpers/must-match.validator';
import { switchMap, filter, throttleTime } from 'rxjs/operators';
import { UsersService } from 'app/shared/services/users.service';
import { element } from 'protractor';

@Component({
  selector: 'app-use-add-admin',
  templateUrl: './use-add-admin.component.html',
  styleUrls: ['./use-add-admin.component.scss']
})
export class UseAddAdminComponent implements OnInit {

    registroForm
    submitted =false
    modulos$: Observable<any[]>;
    modulosFull$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    user$: Observable<any>;
    userToEdit$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    modulosAct
    constructor(
      private fb: FormBuilder,
      private router: Router,
      private requestService: RequestService,
      private toast: ToastrService,
      private userService: UsersService,
      private activeRouter: ActivatedRoute
    ) { 
      this.registroForm = this.fb.group({
        id:[''],
        first_name: ['', [Validators.required,
          Validators.pattern('[a-zA-Z ]*')
        ]],
        second_name: ['', [Validators.pattern('[a-zA-Z ]*')
        ]],
        primer_apelli: ['', [Validators.required,
          Validators.pattern('[a-zA-Z ]*')
        ]],
        segundo_apell: ['',[Validators.pattern('[a-zA-Z ]*')
        ]],
  
        tipo_de_docum: ['C.C', Validators.required],
        
        n_documento: ['',[Validators.required,
          Validators.pattern(/^-?(0|[1-9]\d*)?$/)
        ]],
        user_email: ['', 
          [
            Validators.required,
            Validators.pattern(
              new RegExp(
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              )
            )
          ]
        ],
        telfono_celul: ['', [Validators.required,Validators.maxLength(10),
          Validators.pattern(/^-?(|[0-9]\d*)?$/)
        ]],
        user_pass:[''],
        confirmation_password:[''],
        roles:[[1]],
        modulos: new FormArray([], [])
       
      },
      {
        validator: MustMatch('user_pass', 'confirmation_password')
      });
      this.modulos$ = this.requestService.modulos$;
      this.activeRouter.params
      .pipe(
        switchMap(params => {
          if (params['id']) {
            return this.userService.show(params['id']);
          } else {
            this.registroForm.get("user_pass").setValidators([
              Validators.required, 
              Validators.pattern(
                new RegExp(
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/
                )
              )
            ]);
            this.registroForm.get("user_pass").updateValueAndValidity();
            this.registroForm.get("confirmation_password").setValidators([Validators.required]);
            this.registroForm.get("confirmation_password").updateValueAndValidity();
            return of(null);
          }
        })
      )
      .subscribe(async user => {
        if (user) {
          console.log('user',user)
          this.userToEdit$.next(user);
          this.registroForm.controls['id'].setValue(user['id']);
          this.registroForm.controls['first_name'].setValue(user['first_name']);
          this.registroForm.controls['primer_apelli'].setValue(user['last_name']);
          this.registroForm.controls['segundo_apell'].setValue(user['second_last_name']);
          this.registroForm.controls['second_name'].setValue(user['second_name']);
          this.registroForm.controls['n_documento'].setValue(user['n_document']);
          this.registroForm.controls['telfono_celul'].setValue(user['phone_number']);
          this.registroForm.controls['user_email'].setValue(user['email']);
          this.registroForm.controls['user_pass'].setValue(1);
          this.registroForm.controls['tipo_de_docum'].setValue(true);
          this.registroForm.controls['confirmation_password'].setValue(1);
          if(user['ModulosActivos'] && user['ModulosActivos'].modulos ){
            this.modulosAct = JSON.parse(user['ModulosActivos'].modulos);
            const formArray: FormArray = this.registroForm.get('modulos') as FormArray;
            let ar = []
             await this.modulos$.subscribe((elemento)=>{
              console.log(elemento);
              console.log('pppppp',elemento['data']);
              if(elemento['data']){
                this.modulosAct.forEach((elem)=>{
                  console.log("=>",elem)
                  formArray.push(new FormControl(elem));
                  elemento['data'].forEach((e,index)=>{
                    
                    if(e.nombre.toUpperCase() == elem.toUpperCase()){
                      console.log("==>",index)
                      // e['checked'] = true;
                      // ar.push(e);
                      elemento['data'][index]['checked'] = true
                    }else{
                      // e['checked'] = false;
                      // ar.push(e);
                      // this.modulos$['data'][index]['checked'] = false
                      if(!elemento['data'][index]['checked']){
                        elemento['data'][index]['checked'] = false
                      }
                      
                    }
                  })
                  // element['data']
                })
              }
              // this.modulosFull$.next(ar);
              console.log('moduloFinal', this.modulos$)
              console.log(this.registroForm.value)
            })
            
          }else{
            this.modulosAct = [];
          }
          // this.formUser.controls['password'].setValue(user['password']);
          // this.registroForm.controls['roles'].setValue(
          //   user['roles'].map(rol => rol['id'])
          // );
          
        }
      });
    }
    ngOnInit() {
      registerLocaleData(localeEs, 'es');
      this.requestService.getModulos({page:1,per_page:100});
      console.log('modulos',this.modulos$);
  
    }
    get f() { return this.registroForm.controls; }
    add(){
      this.submitted =true
      if (this.registroForm.invalid) {
        this.submitted =false
        console.log("aqui")
          return;
      }
      let data={"registro":this.registroForm.value}
      this.requestService.consultaUsuario(data).subscribe((res)=>{
        let formData:FormData = new FormData();
        formData.append("email", this.registroForm.get('user_email').value);
        formData.append("first_name", this.registroForm.get('first_name').value);
        formData.append("last_name", this.registroForm.get('primer_apelli').value);
        formData.append("second_name", this.registroForm.get('second_name').value);
        formData.append("second_last_name", this.registroForm.get('segundo_apell').value);
        formData.append("password", this.registroForm.get('user_pass').value);
        formData.append("n_document", this.registroForm.get('n_documento').value);
        formData.append("phone_number", this.registroForm.get('telfono_celul').value);
        formData.append("roles", this.registroForm.get('roles').value);
        formData.append("modulos", JSON.stringify(this.registroForm.get('modulos').value));
        this.requestService.agregarUsuario(formData).subscribe((res)=>{
          this.submitted =false
          this.toast.success("Registro exitoso!");
          this.registroForm.reset();
          this.router.navigate(['/admin/users/list-admin']);
          console.log(res)
        },(error)=>{
          this.submitted =false
          this.toast.error("Registro fallido!");
          console.log(error)
        })
      },(error)=>{
        this.submitted =false
        this.toast.error(error.error.message)
      })
    }

    edit() {
      this.submitted = true;
      let formData:FormData = new FormData();
        formData.append("id", this.registroForm.get('id').value);
        formData.append("email", this.registroForm.get('user_email').value);
        formData.append("first_name", this.registroForm.get('first_name').value);
        formData.append("last_name", this.registroForm.get('primer_apelli').value);
        formData.append("second_name", this.registroForm.get('second_name').value);
        formData.append("second_last_name", this.registroForm.get('segundo_apell').value);
        formData.append("n_document", this.registroForm.get('n_documento').value);
        formData.append("phone_number", this.registroForm.get('telfono_celul').value);
        formData.append("roles", this.registroForm.get('roles').value);
        formData.append("modulos", JSON.stringify(this.registroForm.get('modulos').value));
      if (this.registroForm.valid) {
        const id = this.registroForm.controls['id'].value;
        this.userService.updateUser(id, formData).subscribe(response => {
          if (response) {
            this.submitted =false
            this.toast.success(response['message']);
            this.router.navigate(['/admin/users/list-admin']);
          } else {
            this.submitted =false
            this.toast.error(JSON.stringify(response));
          }
        });
      }else{
        this.submitted =false
        console.log("error form")
      }
 // console.log(this.formUser.value);
}
      onCheckChange(event) {
        const formArray: FormArray = this.registroForm.get('modulos') as FormArray;
      
        /* Selected */
        if(event.target.checked){
          // Add a new control in the arrayForm
          formArray.push(new FormControl(event.target.value));
        }
        /* unselected */
        else{
          // find the unselected element
          let i: number = 0;
      
          formArray.controls.forEach((ctrl: FormControl) => {
            if(ctrl.value == event.target.value) {
              // Remove the unselected element from the arrayForm
              formArray.removeAt(i);
              return;
            }
      
            i++;
          });
        }
        console.log("ff", this.registroForm.value);
      }

}
