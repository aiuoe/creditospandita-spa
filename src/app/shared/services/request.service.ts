import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) { }
  aprobados$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  preaprobados$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  contraOfertas$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  modulos$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  creditos$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  add(params) {
    let data = {solicitud: params}
    return this.http.post(`financiera/solicitud`, data);
  }
  addUserNew(params) {
    let data = params
    return this.http.post(`storeUserBasica`, data);
  }
  informacionCompleta(params) {
    let data = {id: params}
    return this.http.post(`informacionCompleta`, data);
  }
  consultaContraoferta(params) {
    let data = {id: params}
    return this.http.post(`consultaContraoferta`, data);
  }
  consultaUsuario(params) {
    
    return this.http.post(`consultaUsuario`, params);
  }

  obtenerCupon(params) {
    
    return this.http.post(`financiera/obtenerCupon`, params);
  }

  obtenerCuponPreview(params){
    return this.http.post(`financiera/obtenerCuponPreview`, params);
  }
  editarContraOferta(data){
    return this.http.post('contraOferta/actualizaEstatus', data);
  }
  estatusNovacion(data){
    let params ={idSolicitud:data}
    return this.http.post(`users/estatusNovacion`, params);
  }
  // getCreditos(param) {
  //   // let param={id:0}
  //   // console.log(params)
  //   return this.http.post(`financiera/obtenerCreditos`,param);
  // }
  getCreditos(params?) {
    let parseParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(p => {
        parseParams = parseParams.append(p, params[p]);
      });
    }
    this.http
      .get<any[]>(`financiera/obtenerCreditos`, { params: parseParams })
      .subscribe(aprobados => {
        this.aprobados$.next(aprobados);
      });
  }
  getAprobados(params?) {
    let parseParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(p => {
        parseParams = parseParams.append(p, params[p]);
      });
    }
    this.http
      .get<any[]>(`contraOferta/aprobados`, { params: parseParams })
      .subscribe(aprobados => {
        this.aprobados$.next(aprobados);
      });
  }
  getPreAprobados(params?) {
    let parseParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(p => {
        parseParams = parseParams.append(p, params[p]);
      });
    }
    this.http
      .get<any[]>(`contraOferta/preaprobados`, { params: parseParams })
      .subscribe(preaprobados => {
        this.preaprobados$.next(preaprobados);
      });
  }

  getEstatus(params?) {
    let parseParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(p => {
        parseParams = parseParams.append(p, params[p]);
      });
    }
    this.http
      .get<any[]>(`contraOferta/allEstatus`, { params: parseParams })
      .subscribe(contraOfertas => {
        this.contraOfertas$.next(contraOfertas);
      });
  }
  getContraOfertas(params?) {
    let parseParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(p => {
        parseParams = parseParams.append(p, params[p]);
      });
    }
    this.http
      .get<any[]>(`contraOferta/allUser`, { params: parseParams })
      .subscribe(contraOfertas => {
        this.contraOfertas$.next(contraOfertas);
      });
  }
  agregarUsuario(data){
    return this.http.post('users/create', data);
  }

  getModulos(params?) {
    let parseParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(p => {
        parseParams = parseParams.append(p, params[p]);
      });
    }
    this.http
      .get<any[]>(`modulos/allAdmin`, { params: parseParams })
      .subscribe(modulos => {
        this.modulos$.next(modulos);
      });
  }
}
