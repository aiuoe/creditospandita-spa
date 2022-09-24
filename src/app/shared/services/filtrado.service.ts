import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FiltradoService {

  blogs$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  cupones$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
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
      .get<any[]>(`filtrado/get`, { params: parseParams })
      .subscribe(filtrado => {
        this.blogs$.next(filtrado);
      });
  }
  getCupones(params?) {
    let parseParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(p => {
        parseParams = parseParams.append(p, params[p]);
      });
    }
    this.http
      .get<any[]>(`financiera/getAllCupones`, { params: parseParams })
      .subscribe(filtrado => {
        this.cupones$.next(filtrado);
      });
  }
  // get(params) {
  //   this.http.post<any[]>(`filtrador/get`, params ).subscribe(blogs => {
  //     this.blogs$.next(blogs);
  //   });
  // }

  show(index: number) {
    let params = {id : index}
    return this.http.post(`filtrado/getFiltro`, params);
  }

  estadisticas(params) {
    // let params = {id : 0}
    return this.http.post(`evaluacion/estadisticas`, params);
  }

  add(params) {
    return this.http.post(`filtrado/create`, params);
  }

  addCupones(params) {
    return this.http.post(`financiera/createCupon`, params);
  }

  update(params) {
    return this.http.post(`filtrado/update`, params);
  }

  delete(id) {
    let params = {id : id}
    return this.http.post(`filtrado/delete`,params);
  }
  deleteCupon(id) {
    let params = {id : id}
    return this.http.post(`financiera/deleteCupon`,params);
  }
}
