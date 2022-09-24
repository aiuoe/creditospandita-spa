import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ConfigCalculadoraService {
  configuraciones$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  configuracionesCannon$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  configuracionesIngreso$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  configuraciones2$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  constructor(private http: HttpClient) { }

  get(params?) {
    let parseParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(p => {
        parseParams = parseParams.append(p, params[p]);
      });
    }
    this.http
      .get<any[]>(`configCalculadora/all`, { params: parseParams })
      .subscribe(configuraciones => {
        this.configuraciones$.next(configuraciones);
      });
  }

  show(index: number) {
    let params = {id : index}
    return this.http.post(`configCalculadora/get`, params);
  }
  showContraOferta(index: number) {
    let params = {id : index}
    return this.http.post(`configContraOferta/get`, params);
  }
  getContraofertas(params?) {

    let parseParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(p => {
        parseParams = parseParams.append(p, params[p]);
      });
    }
    this.http
      .get<any[]>(`configContraOferta/all`, { params: parseParams })
      .subscribe(configuraciones => {
        this.configuraciones2$.next(configuraciones);
      });
  
    // return this.http.get(`configContraOferta/all`);
  }

  getTipo(index: number) {
    let params = {tipo : index}
    return this.http.post(`configCalculadora/getTipo`, params);
  }

  getTipoContraOferta(index: number) {
    let params = {tipo : index}
    return this.http.post(`configContraOferta/getTipo`, params);
  }
  add(params) {
    return this.http.post(`configCalculadora/create`, params);
  }

  update(params) {
    return this.http.post(`configCalculadora/update`, params);
  }
  updateContraOferta(params) {
    return this.http.post(`configContraOferta/update`, params);
  }
  delete(id) {
    let params = {id : id}
    return this.http.post(`configCalculadora/delete`,params);
  }

  getCannon(params?) {
    let parseParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(p => {
        parseParams = parseParams.append(p, params[p]);
      });
    }
    this.http
      .get<any[]>(`cannonAlojamiento/all`, { params: parseParams })
      .subscribe(configuraciones => {
        this.configuracionesCannon$.next(configuraciones);
      });
  }

  showCannon(index: number) {
    let params = {id : index}
    return this.http.post(`cannonAlojamiento/get`, params);
  }

  addCannon(params) {
    return this.http.post(`cannonAlojamiento/create`, params);
  }

  updateCannon(params) {
    return this.http.post(`cannonAlojamiento/update`, params);
  }
  deleteCannon(id) {
    let params = {id : id}
    return this.http.post(`cannonAlojamiento/delete`,params);
  }
  getIngreso(params?) {
    let parseParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(p => {
        parseParams = parseParams.append(p, params[p]);
      });
    }
    this.http
      .get<any[]>(`ingresoPrincipal/all`, { params: parseParams })
      .subscribe(configuraciones => {
        this.configuracionesIngreso$.next(configuraciones);
      });
  }

  showIngreso(index: number) {
    let params = {id : index}
    return this.http.post(`ingresoPrincipal/get`, params);
  }

  addIngreso(params) {
    return this.http.post(`ingresoPrincipal/create`, params);
  }

  updateIngreso(params) {
    return this.http.post(`ingresoPrincipal/update`, params);
  }
  deleteIngreso(id) {
    let params = {id : id}
    return this.http.post(`ingresoPrincipal/delete`,params);
  }
}
