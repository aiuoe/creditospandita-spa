import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VariablesService {

  blogs$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  constructor(private http: HttpClient) {
  }

  get(params) {
    this.http.post<any[]>(`variables/get`, params ).subscribe(blogs => {
      this.blogs$.next(blogs);
    });
  }

  
  get2() {

    return this.http.post(`variables/get`, '');
  }

  show(index: number) {
    let params = {id : index}
    return this.http.post(`variables/getVariable`, params);
  }

  add(params) {
    return this.http.post(`variables/create`, params);
  }

  update(params) {
    return this.http.post(`variables/update`, params);
  }

  delete(id) {
    let params = {id : id}
    return this.http.post(`variables/delete`,params);
  }
}
