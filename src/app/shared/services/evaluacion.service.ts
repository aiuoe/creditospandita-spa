import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import * as FileSaver from 'file-saver';
@Injectable({
  providedIn: 'root'
})
export class EvaluacionService {

  configuraciones$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  configIngreso$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  alertas$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  endeudamientos$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  porSector$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  constructor(private http: HttpClient) { }

  get(params?) {
    let parseParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(p => {
        parseParams = parseParams.append(p, params[p]);
      });
    }
    this.http
      .get<any[]>(`evaluacion/all`, { params: parseParams })
      .subscribe(configuraciones => {
        this.configuraciones$.next(configuraciones);
      });
  }

  show(index: number) {
    let params = {id : index}
    return this.http.post(`evaluacion/get`, params);
  }

  getTipo(index: number) {
    let params = {tipo : index}
    return this.http.post(`evaluacion/getTipo`, params);
  }

  add(params) {
    return this.http.post(`evaluacion/create`, params);
  }

  update(params) {
    return this.http.post(`evaluacion/update`, params);
  }

  updateSelfie(params) {
    return this.http.post(`evaluacion/updateSelfie`, params);
  }
  updateBalance(params) {
    return this.http.post(`evaluacion/updateBalance`, params);
  }
  updateCalculos(params) {
    return this.http.post(`evaluacion/updateCalculos`, params);
  }
  exportFileEvaluaciones() {
    return this.http
  .get(`evaluacion/exportExcel`, { responseType: 'blob' })
  .subscribe(file => {
    FileSaver.saveAs(file, 'evaluaciones');
  });
  }
  updateIdentidad(params) {
    return this.http.post(`evaluacion/updateIdentidad`, params);
  }

  updateAdicionales(params) {
    return this.http.post(`evaluacion/updateAdicionales`, params);
  }

  updateLlamada(params) {
    return this.http.post(`evaluacion/updateLlamada`, params);
  }

  updateDc(params) {
    return this.http.post(`evaluacion/updateDataCredito`, params);
  }

  showSolicitud(index: number) {
    let params = {id : index}
    return this.http.post(`evaluacion/showSolicitud`, params);
  }

  comentarioSelfie(params) {
    return this.http.post(`evaluacion/comentarioSelfie`, params);
  }

  comentarioIdentidad(params) {
    return this.http.post(`evaluacion/comentarioIdentidad`, params);
  }

  comentarioAdicionales(params) {
    return this.http.post(`evaluacion/comentarioAdicional`, params);
  }

  comentarioLlamada(params) {
    return this.http.post(`evaluacion/comentarioLamada`, params);
  }
  delete(id) {
    let params = {id : id}
    return this.http.post(`evaluacion/delete`,params);
  }
  generarteFile(id) {
    
    return this.http.get(`users/export/${id}`);
  }
  crearContraOferta(data) {
    let params = data
    return this.http.post(`createContraOferta`,params);
  }
  solicitarFirma(data) {
    let params = data
    return this.http.post(`financiera/solicitarFirma`,params);
  }
  exportFile(id) {
    this.http
    .get(`users/export/${id}`, { responseType: 'blob' })
    .subscribe(file => {
      FileSaver.saveAs(file, 'contrato');
    });
  }

  getIngresoActividad(id){
    let params = {id : id}
    return this.http.post(`ingresoPrincipal/get`,params);
  }
  getIngresoActividadAll(params?) {
    let parseParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(p => {
        parseParams = parseParams.append(p, params[p]);
      });
    }
    this.http
      .get<any[]>(`ingresoPrincipal/all`, { params: parseParams })
      .subscribe(configuraciones => {
        this.configIngreso$.next(configuraciones);
      });
  }

  getEstratoAlojamiento(params){
    
    return this.http.post(`cannonAlojamiento/getEstratoAlojamiento`,params);
  }

  enviarCorreoRequeridoSelfie(params){
    
    return this.http.post(`evaluacion/solicitarSelfie`,params);
  }
  enviarCorreoRequeridoAdicionales(params){
    
    return this.http.post(`evaluacion/solicitarAdicional`,params);
  }
  enviarCorreoRequeridoCertificado(params){
    
    return this.http.post(`evaluacion/solicitarCertificado`,params);
  }
  enviarCorreoRequeridoCertificadoLaboral(params){
    
    return this.http.post(`evaluacion/solicitarCertificadoLaboral`,params);
  }
  enviarCorreoRequeridoDesprendible(params){
    
    return this.http.post(`evaluacion/solicitarDesprendible`,params);
  }
  enviarCorreoRequeridoExtracto(params){
    
    return this.http.post(`evaluacion/solicitarExtracto`,params);
  }
  estatusSolicitudes(params){
    
    return this.http.post(`evaluacion/estatusSolicitudes`,params);
  }
  enviarCorreoVerificacion(params){
    
    return this.http.post(`evaluacion/solicitarVerificacion`,params);
  }
  crearDataCredito(params){
    return this.http.post(`dataCredito/create`,params)
  }
  modificarDataCredito(params){
    return this.http.post(`dataCredito/update`,params)
  }
  crearAlerta(params){
    return this.http.post(`dataCredito/createAlerta`,params)
  }
  crearEndeudamiento(params){
    return this.http.post(`dataCredito/createEndeudamiento`,params)
  }
  crearPorSector(params){
    return this.http.post(`dataCredito/createPorSector`,params)
  }
  alertasAll(params?) {
    let parseParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(p => {
        parseParams = parseParams.append(p, params[p]);
      });
    }
    this.http
      .get<any[]>(`dataCredito/allAlertas`, { params: parseParams })
      .subscribe(configuraciones => {
        this.alertas$.next(configuraciones);
      });
  }
  endeudamientoAll(params?) {
    let parseParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(p => {
        parseParams = parseParams.append(p, params[p]);
      });
    }
    this.http
      .get<any[]>(`dataCredito/allEndeudamientos`, { params: parseParams })
      .subscribe(configuraciones => {
        this.endeudamientos$.next(configuraciones);
      });
  }
  porSectorAll(params?) {
    let parseParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(p => {
        parseParams = parseParams.append(p, params[p]);
      });
    }
    this.http
      .get<any[]>(`dataCredito/allPorSector`, { params: parseParams })
      .subscribe(configuraciones => {
        this.porSector$.next(configuraciones);
      });
  }
  getDC(index: number) {
    let params = {id : index}
    return this.http.post(`dataCredito/get`, params);
  }

  borrarAlerta(params){
    return this.http.post(`dataCredito/deleteAlerta`,params)
  }
  borrarEndeudamiento(params){
    return this.http.post(`dataCredito/deleteEndeudamiento`,params)
  }
  borrarPorSector(params){
    return this.http.post(`dataCredito/deletePorSector`,params)
  }
  guardarEB(params){
    return this.http.post(`extratosBancarios/create`,params)
  }
  guardarEBP(params){
    return this.http.post(`extratosBancarios/createPagos`,params)
  }
  guardarEBC(params){
    return this.http.post(`extratosBancarios/createCreditos`,params)
  }
  obtenerEB(params){
    return this.http.post(`extratosBancarios/get`,params)
  }
  obtenerEBP(params){
    return this.http.post(`extratosBancarios/getPagos`,params)
  }
  obtenerEBC(params){
    return this.http.post(`extratosBancarios/getCreditos`,params)
  }
  borrarEBP(params){
    return this.http.post(`extratosBancarios/deletePagos`,params)
  }
  borrarEBC(params){
    return this.http.post(`extratosBancarios/deleteCreditos`,params)
  }
  updateEb(params) {
    return this.http.post(`evaluacion/updateExtractoBancario`, params);
  }
  updateEbTipoPagoNomina(params) {
    return this.http.post(`extratosBancarios/update`, params);
  }
  manualApproveEmail(params) {
    return this.http.post(`evaluacion/manualApproveEmail`, params);
  }
  manualApproveVerifiquese(params) {
    return this.http.post(`evaluacion/manualApproveVerifiquese`, params);
  }
  approveVerifiquese(params) {
    return this.http.post(`financiera/analisis`, params);
  }
}
