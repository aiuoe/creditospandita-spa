import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParascoreService {

  blogs$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  constructor(private http: HttpClient) {
  }
  get(params?) {
    let parseParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(p => {
        parseParams = parseParams.append(p, params[p]);
      });
    }
    this.http
      .get<any[]>(`parascore/get`, { params: parseParams })
      .subscribe(preguntas => {
        this.blogs$.next(preguntas);
      });
  }
  // get(params) {
  //   this.http.post<any[]>(`parascore/get`, params ).subscribe(blogs => {
  //     this.blogs$.next(blogs);
  //   });
  // }

  show(index: number) {
    let params = {id : index}
    return this.http.post(`parascore/getscore`, params);
  }

  add(params) {
    return this.http.post(`parascore/create`, params);
  }

  update(params) {
    return this.http.post(`parascore/update`, params);
  }

  delete(id) {
    let params = {id : id}
    return this.http.post(`parascore/delete`,params);
  }
}
