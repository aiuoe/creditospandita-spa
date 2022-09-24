import { Component, ViewChild, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'app/shared/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-register-page',
    templateUrl: './register-page.component.html',
    styleUrls: ['./register-page.component.scss']
})

export class RegisterPageComponent implements OnInit  {
    registerForm: FormGroup;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private auth: AuthService,
    private toast: ToastrService) { 
      this.registerForm = this.fb.group({
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        email: ['', Validators.required],
        password: ['', Validators.required]
      });
    }
    ngOnInit() {
        
    }
    register(){
        if (this.registerForm.valid) {
            console.log('aqui');
          this.auth.register(this.registerForm.value).subscribe(response =>{
            this.registerForm.reset();
            this.toast.success(response['message']);
            console.log(response);
          },error => {
            console.log(error);
            this.toast.error("Error al tratar de registrase");
            let mensaje =error.error.errors;
            Object.keys(mensaje).forEach(key => {
              console.log(key)
              this.toast.error(mensaje[key][0]);
              console.log(mensaje[key][0])
             });
          });
        }
      }
}