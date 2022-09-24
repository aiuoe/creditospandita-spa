import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ContactsFormService {

  contacts$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  constructor(private http: HttpClient) {
    this.get();
  }
  get(params?) {
    let parseParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(p => {
        parseParams = parseParams.append(p, params[p]);
      });
    }
    this.http
      .get<any[]>(`contacto/get`, { params: parseParams })
      .subscribe(contacts => {
        this.contacts$.next(contacts);
      });
  }
  // get(params?) {
  //   this.http.post<any[]>(`contacto/get`, { params }).subscribe(contacts => {
  //     this.contacts$.next(contacts);
  //   });
  // }

  show(index: number) {
    let params = {id : index}
    return this.http.post(`contacto/show`, params);
  }

  add(params) {
    return this.http.post(`contacto/create`, params);
  }

  update(params) {
    return this.http.post(`contacto/update`, params);
  }

  delete(id) {
    let params = {id : id}
    return this.http.post(`contacto/delete`,params);
  }
}
