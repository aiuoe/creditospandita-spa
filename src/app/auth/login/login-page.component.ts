import { Component, ViewChild, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'app/shared/auth/auth.service';
import { MessagingService } from 'app/shared/auth/messaging.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from "../../../environments/environment";
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private auth: AuthService,
    private toast: ToastrService,
    private notificacion: MessagingService
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // this.router.navigate(['home']);
    this.route.params.subscribe(params => {
      // params["id"] = modo_edición
      if (params['id']) {
        localStorage.clear();
        console.log('logueando', params['id'])
        this.loginToken(params['id']);
        // this.router.navigate(['/']);
      }else{
          localStorage.clear();
          // this.toast.error('Autenticación fallida');
          let ruta = environment.webUrl+"/login";
          window.open(ruta, "_self");
      } 
    });
  }
  loginToken(params) {
    
      this.auth.userToken(params).subscribe({
        next: response => {
          if (response['access_token']) {
            this.toast.success(`Bienvenido ${response['user']['first_name']}`);
            const roles = localStorage.getItem('roles');
            if(roles=='Cliente'){
              this.router.navigate(['/']);
            }else if(roles=='Referido'){
              this.router.navigate(['/credit/referido']);
            }
            else if(roles=='ReferidoCliente'){
              this.router.navigate(['/credit/referido']);
            }else if(roles=='Administrador'){
              this.notificacion.requestPermission().then(token => {
                localStorage.setItem("fbtoken",token.toString())
                let d = {
                  idUser:response['user']['id'],
                  token:token.toString()
                }
                this.auth.actTokenFb(d).subscribe(res =>{
                  // console.log()
                },err =>{

                })
                // console.log(token);
              })
              this.router.navigate(['/admin/users/list']);
            }
            
          } else {
            this.toast.error(response['message']);
            localStorage.clear();
            let ruta = environment.webUrl+"/login";;
            window.open(ruta, "_self");
          }
        },
        error: error => {
          // console.log("err->", error);
          localStorage.clear();
          this.toast.error('Autenticación fallida');
          let ruta = environment.webUrl+"/login";
          window.open(ruta, "_self");
        }
      });
    
  }

  login() {
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value).subscribe({
        next: response => {
          if (response['access_token']) {
            this.toast.success(`Bienvenido ${response['user']['first_name']}`);
            this.router.navigate(['home']);
          } else {
            this.toast.error(response['message']);
          }
        },
        error: error => {
          this.toast.error('Autenticación fallida');
        }
      });
    }
  }

  // On submit button click
  onSubmit() {}
  // On Forgot password link click
  onForgotPassword() {
    this.router.navigate(['forgotpassword'], { relativeTo: this.route.parent });
  }
  // On registration link click
  onRegister() {
    this.router.navigate(['register'], { relativeTo: this.route.parent });
  }
}
