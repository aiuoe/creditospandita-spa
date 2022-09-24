import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  users$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  usersAdmin$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  usersReferidos$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  usersMisReferidos$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  constructor(private http: HttpClient) {
    // this.get();
  }

  get(params?) {
    this.http.get<any[]>(`users`, { params }).subscribe(users => {
      this.users$.next(users);
    });
  }
  getReferidos(params?) {
    this.http.get<any[]>(`users/allReferidos`, { params }).subscribe(users => {
      this.usersReferidos$.next(users);
    });
  }
  getMisReferidos(id,params?) {
    this.http.get<any[]>(`users/misReferidos/${id}`, { params }).subscribe(users => {
      this.usersMisReferidos$.next(users);
    });
  }



  getAdmin(params?) {
    this.http.get<any[]>(`users/allAdmin`, { params }).subscribe(users => {
      this.usersAdmin$.next(users);
    });
  }
  getListanegra(params?) {
    this.http.get<any[]>(`blacklist`, { params }).subscribe(users => {
      this.users$.next(users);
    });
  }

  show(index: number) {
    return this.http.get(`users/${index}`);
  }

  add(params: {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    'office_id[]': number[];
    'roles[]': string[];
    avatar?: string;
  }) {
    return this.http.post(`users`, params);
  }

  update(
    id: number,
    params: {
    
      password: string;

      'roles[]': string[];

    }
  ) {
    return this.http.put(`users/${id}`, params);
  }

  updateUser(
    id: number,
    params
  ) {
    return this.http.post(`users/updateUser`, params);
  }

  listanegra(id) {
    return this.http.post(`listanegra`, id);
  }
  blackList
  delete(id: number) {
    return this.http.delete(`users/${id}`);
  }
  detallePago(params) {
    return this.http.post(`detallePagoReferidor`, params);
  }
}
