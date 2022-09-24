import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BlogsService {

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
      .get<any[]>(`blogs/get`, { params: parseParams })
      .subscribe(blogs => {
        this.blogs$.next(blogs);
      });
  }

  // get(params) {
  //   this.http.post<any[]>(`blogs/get`, params ).subscribe(blogs => {
  //     this.blogs$.next(blogs);
  //   });
  // }

  show(index: number) {
    let params = {id : index}
    return this.http.post(`blogs/getBlog`, params);
  }

  add(params) {
    return this.http.post(`blogs/create`, params);
  }

  update(params) {
    return this.http.post(`blogs/update`, params);
  }

  delete(id) {
    let params = {id : id}
    return this.http.post(`blogs/delete`,params);
  }
}
