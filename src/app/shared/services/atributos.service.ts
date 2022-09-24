import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AtributosService {

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
      .get<any[]>(`atributos/get`, { params: parseParams })
      .subscribe(atributos => {
        this.blogs$.next(atributos);
      });
  }
  // get(params) {
  //   this.http.post<any[]>(`atributos/get`, params ).subscribe(blogs => {
  //     this.blogs$.next(blogs);
  //   });
  // }

  show(index: number) {
    let params = {id : index}
    return this.http.post(`atributos/getAtributo`, params);
  }

  add(params) {
    return this.http.post(`atributos/create`, params);
  }
  addDesembolso(params) {
    return this.http.post(`financiera/desembolso`, params);
  }
  addDesembolsoReferidor(params) {
    return this.http.post(`users/desembolsoReferido`, params);
  }

  update(params) {
    return this.http.post(`atributos/update`, params);
  }

  delete(id) {
    let params = {id : id}
    return this.http.post(`atributos/delete`,params);
  }
  enviarCampCorrecta(leadId,visitor) {
    let data = {
      leadId: leadId,
      visitor: visitor,
      type:'CPA'
    }
    // return this.http.get('http://tracker2.doaffiliate.net/api/creditospanda-com?type=CPA&lead='+leadId+'&v='+visitor+'');
    return this.http.post(`campana`, data);
  }
}
