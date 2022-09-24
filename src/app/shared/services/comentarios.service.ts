import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComentariosService {

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
      .get<any[]>(`comentarios/get`, { params: parseParams })
      .subscribe(testimoniales => {
        this.testimoniales$.next(testimoniales);
      });
  }

  // get(params?) {
  //   this.http.post<any[]>(`comentarios/get`, params).subscribe(testimoniales => {
  //     this.testimoniales$.next(testimoniales);
  //   });
  // }


  getEvaluacion(params) {
  
    return this.http.post(`comentarios/getEvaluacion`, params);
  }
  getComentariosSolicitud(params) {
  
    return this.http.post(`comentarios/solicitud`, params);
  }
  show(index: number) {
    let params = {id : index}
    return this.http.post(`comentarios/getComentario`, params);
  }

  add(params) {
    return this.http.post(`comentarios/create`, params);
  }
  addSolicitud(params) {
    return this.http.post(`comentarios/createSolicitud`, params);
  }
  update(params) {
    return this.http.post(`comentarios/update`, params);
  }

  delete(id) {
    let params = {id : id}
    return this.http.post(`comentarios/delete`,params);
  }
}
