import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import * as FileSaver from 'file-saver';
@Injectable({
  providedIn: 'root'
})
export class MorososService {

  constructor(private http: HttpClient) { }

  getMorosos(params) {
    return this.http.get<any>(environment.apiUrl + "/financiera/obtenerCreditosMorosos",
      {
        params,
	   		headers: new HttpHeaders({
          "Accept" : "application/json",
          "Content-Type" : "application/json"
	    	})
    	});
  }

  storeHistoryContact(params){
    return this.http.post<any>(environment.apiUrl + "/contact-history/store", params,
      {
	   		headers: new HttpHeaders({
          "Accept" : "application/json",
          "Content-Type" : "application/json"
	    	})
    	});
  }

  generateDescuentoLibranzaPdf(params){
    this.http.get(`financiera/generateDescuentoLibranzaDocument`, {params, responseType: 'blob' })
    .subscribe(file => {
      FileSaver.saveAs(file, 'descuento_libranza');
    });
  }

  generateControlBancoPdf(params){
    this.http.get(`financiera/generateControlBancoDocument`, {params, responseType: 'blob' })
    .subscribe(file => {
      FileSaver.saveAs(file, 'control_deposito_bancario');
    });
  }

  generateAvisoPrejuridicoPdf(params){
    this.http.get(`financiera/generateAvisoPrejuridicoDocument`, {params, responseType: 'blob' })
    .subscribe(file => {
      FileSaver.saveAs(file, 'aviso_prejuridico');
    });
  }
}
