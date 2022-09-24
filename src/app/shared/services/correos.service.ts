import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CorreosService {

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
      .get<any[]>(`correos/get`, { params: parseParams })
      .subscribe(testimoniales => {
        this.testimoniales$.next(testimoniales);
      });
  }

  show(index: number) {
    let params = {id : index}
    return this.http.post(`correos/getCorreos`, params);
  }

  getTipo(index: number) {
    let params = {tipo : index}
    return this.http.post(`correos/getTipo`, params);
  }

  add(params) {
    return this.http.post(`correos/create`, params);
  }

  invitar(params) {
    return this.http.post(`invitar`, params);
  }

  update(params) {
    return this.http.post(`correos/update`, params);
  }

  cambioEstatus(params) {
    return this.http.post(`correos/cambioEstatus`, params);
  }


  delete(id) {
    let params = {id : id}
    return this.http.post(`correos/delete`,params);
  }
}
