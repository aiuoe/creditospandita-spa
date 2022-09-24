import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { OnesignalService } from './onesignal.service';

@Injectable()
export class AuthService {
  user$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  main_office$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  roles$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  token: string;
  constructor(
    private http: HttpClient,
    private router: Router,
    private onesignal: OnesignalService
  ) {
    this.token = localStorage.getItem('token');
    // const roles: any[] = JSON.parse(localStorage.getItem('roles'));
    // if (localStorage.getItem('roles')) {
    //   this.roles$.next(roles);
    // }
  }

  login(params: { email: string; password: string }) {
    return this.http.post('auth/login', params).pipe(
      map(authData => {
        if (authData) {
          localStorage.setItem('token', authData['access_token']);
          this.token = authData['access_token'];
          localStorage.setItem('user', JSON.stringify(authData['user']));
          localStorage.setItem('roles',
            JSON.stringify('Administrador')
          );
          // this.onesignal.logIn(authData['user']['id']);
          
        }
        return authData;
      })
    );
  }
  userToken(id) {
    var params = {id : id};
    return this.http.get('userToken/'+id).pipe(
      map(authData => {
        if (authData) {
          // console.log("auth",authData);
          localStorage.setItem('token', authData['access_token']);
          this.token = authData['access_token'];
          localStorage.setItem('user', JSON.stringify(authData['user']));
          localStorage.setItem('roles',authData['user']['roles'][0].name);
          // this.onesignal.logIn(authData['user']['id']);
          
        }
        return authData;
      })
    );
  }
  register(params) {
    return this.http.post('auth/register', params);
  }
  logout() {
    
  
    return new Promise((resolve, reject) => {
      localStorage.clear();
      // this.onesignal.logOut();
      this.token = undefined;
      resolve(true)
    });
  
  }

  geToken(): string {
    return localStorage.getItem('token');
  }

  resetPassword(params: {
    password: string;
    password_confirmation: string;
    token: string;
  }) {
    return this.http.post(`password/reset`, params);
  }

  getToken() {
    return this.token;
  }

  isAuthenticated() {
    // here you can check if user is authenticated or not through his token
    const haveToken = this.token ? true : false;
    return haveToken;
  }


  isAdmin(): boolean {
    const roles = localStorage.getItem('roles');
    if (roles=='Administrador') {
        return true;
    }
    return false;
  }
  isClient(): boolean {
    const roles = localStorage.getItem('roles');
    if (roles=='Cliente') {
        return true;
    }
    return false;
  }
  isReferidor(): boolean {
    const roles = localStorage.getItem('roles');
    if (roles=='Referido') {
        return true;
    }
    return false;
  }
  isReferidorCliente(): boolean {
    const roles = localStorage.getItem('roles');
    if (roles=='ReferidoCliente') {
        return true;
    }
    return false;
  }
  actTokenFb(params) {
    return this.http.post(`actualizarFirebase`, params);
  }
}
