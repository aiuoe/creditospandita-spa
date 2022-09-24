import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TestimonialService {
  testimoniales$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  constructor(private http: HttpClient) { }
  
  get(params?) {
    let parseParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(p => {
        parseParams = parseParams.append(p, params[p]);
      });
    }
    this.http
      .get<any[]>(`testimonio/get`, { params: parseParams })
      .subscribe(testimoniales => {
        this.testimoniales$.next(testimoniales);
      });
  }
  // get(params?) {
  //   this.http.post<any[]>(`testimonio/get`, params).subscribe(testimoniales => {
  //     this.testimoniales$.next(testimoniales);
  //   });
  // }

  show(index: number) {
    let params = {id : index}
    return this.http.post(`testimonio/getTestimonio`, params);
  }

  add(params) {
    return this.http.post(`testimonio/create`, params);
  }

  update(params) {
    return this.http.post(`testimonio/update`, params);
  }

  delete(id) {
    let params = {id : id}
    return this.http.post(`testimonio/delete`,params);
  }
}
