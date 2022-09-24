import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders  } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import * as FileSaver from 'file-saver';

import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  country$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  creditosUsuarios$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  creditosUsuariosPor$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  creditosCerrados$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  creditosPagadosUsuarios$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  constructor(private http: HttpClient) {}

  get() {
    let parseParams = new HttpParams();
    this.http
      .get<any[]>(`countries`)
      .subscribe(country => {
        this.country$.next(country);
        
      });
  }

  show(index: number) {
    return this.http.get(`clients/${index}`);
  }

  GetCountries(){
		return this.http.get<any>(
      environment.apiUrl + "/countries",
        	{
	   		 headers: new HttpHeaders({
        "Accept" : "application/json",
        "Content-Type" : "application/json"
	    	})
    	});
  }

  GetActivities(data){
		return this.http.post<any>(
      environment.apiUrl + "/actividad",data,
        	{
	   		 headers: new HttpHeaders({
        "Accept" : "application/json",
        "Content-Type" : "application/json"
	    	})
    	});
  }
  
  
  getBasica(params) {
    // console.log(params)
    return this.http.post(`basica/get`, params);
  }

  getReferencia(params) {
    // console.log(params)
    return this.http.post(`referencias/get`, params);
  }
  getFinanciera(params) {
    // console.log(params)
    return this.http.post(`financiera/get`, params);
  }

  update(
    id: string,
    params) {
    return this.http.post(`basica/update`, params);
  }

  updateReferencia(
    id: string,
    params) {
    return this.http.post(`referencias/update`, params);
  }
  updateFinanciera(
    id: string,
    params) {
    return this.http.post(`financiera/update`, params);
  }
  // exportFile(){
    
  //   this.httpOptions = {headers: new HttpHeaders({'Content-Type':'application/json'}), responseType: 'blob'};
  //   return this.http.get(environment.apiUrl + "/api/file/export", this.httpOptions)
  // }

  getHistory(params) {
    return this.http.post(`getLoans`, params);
  }

  // obtenerCreditosAbiertos(params) {
  //   return this.http.post(`finaciera/obtenerCreditosAbiertos`, params);
  // }

  // obtenerCreditosAbiertos(params?) {
  //   let parseParams = new HttpParams();
  //   if (params) {
  //     Object.keys(params).forEach(p => {
  //       parseParams = parseParams.append(p, params[p]);
  //     });
  //   }
  //   this.http
  //     .get<any[]>(`financiera/obtenerCreditosAbiertos`, { params: parseParams })
  //     .subscribe(aprobados => {
  //       this.aprobados$.next(aprobados);
  //     });
  // }

  // obtenerCreditosAbiertos(data) {
  //   let parseParams = new HttpParams();
  //   this.http
  //     .post<any[]>(`financiera/obtenerCreditosAbiertos`,data)
  //     .subscribe(country => {
  //       this.country$.next(country);
        
  //     });
  // }

  obtenerCreditosAbiertos(params) {
    let parseParams = new HttpParams();
    Object.keys(params).forEach(p => {
      parseParams = parseParams.append(p, params[p]);
    });
    this.http
      .get<any[]>(`financiera/obtenerCreditosAbiertos`, {params: parseParams})
      .subscribe(country => {
        this.country$.next(country);
      });
  }
  obtenerCreditosCerrados(params) {
    let parseParams = new HttpParams();
    Object.keys(params).forEach(p => {
      parseParams = parseParams.append(p, params[p]);
    });
    this.http
      .get<any[]>(`financiera/obtenerCreditosCerrados`, {params: parseParams})
      .subscribe(creditos => {
        this.creditosCerrados$.next(creditos);
      });
  }

  obtenerCreditosAbiertosUsuario(params) {
    let parseParams = new HttpParams();
    Object.keys(params).forEach(p => {
      parseParams = parseParams.append(p, params[p]);
    });
    this.http
      .get<any[]>(`financiera/obtenerCreditosAbiertosUsuario`, {params: parseParams})
      .subscribe(country => {
        this.creditosUsuarios$.next(country);
      });
  }

  obtenerCreditosAbiertosUsuarioPor(params) {
    let parseParams = new HttpParams();
    Object.keys(params).forEach(p => {
      parseParams = parseParams.append(p, params[p]);
    });
    this.http
      .get<any[]>(`financiera/obtenerCreditosAbiertosUsuarioPor`, {params: parseParams})
      .subscribe(country => {
        this.creditosUsuariosPor$.next(country);
      });
  }

  obtenerCreditosPagadosPorUsuario(params) {
    let parseParams = new HttpParams();
    Object.keys(params).forEach(p => {
      parseParams = parseParams.append(p, params[p]);
    });
    this.http
      .get<any[]>(`financiera/obtenerCreditosPagadosUsuario`, {params: parseParams})
      .subscribe(country => {
        this.creditosPagadosUsuarios$.next(country);
      });
  }

  // obtenerCreditosAbiertos(data){
	// 	return this.http.post<any>(
  //     environment.apiUrl + "financiera/obtenerCreditosAbiertos",data,
  //       	{
	//    		 headers: new HttpHeaders({
  //       "Accept" : "application/json",
  //       "Content-Type" : "application/json"
	//     	})
  //   	});
  // }

  exportFile() {
    // Para Probar
    this.http
      .get(`file/export`, { responseType: 'blob' })
      .subscribe(file => {
        FileSaver.saveAs(file, 'SolicitudFisica');
      });
  }
  exportFileUser(offset) {
    let parseParams = new HttpParams();
    parseParams = parseParams.append("offset", offset);
    return this.http
  .get(`users/exportExcel`, { responseType: 'blob',params: parseParams })
  .subscribe(file => {
    FileSaver.saveAs(file, 'dataCliente');
  });
  }
  exportFileUserAdmin() {
  this.http
  .get(`users/exportExcelAdmin`, { responseType: 'blob' })
  .subscribe(file => {
    FileSaver.saveAs(file, 'dataAdmin');
  });
  }

  exportHistorico(param) {
    this.http
    .get(`users/exportPDF/${param}`, { responseType: 'blob' })
    .subscribe(file => {
      FileSaver.saveAs(file, 'historico');
    });
    }

    exportConsignacion(param) {
      this.http
      .get(`users/exportConsignacion/${param}`, { responseType: 'blob' })
      .subscribe(file => {
        FileSaver.saveAs(file, 'consignacion');
      });
      }

    getInformacion(params) {
      // console.log(params)
      return this.http.post(`evaluacion/obtenerDatos`, params);
    }
    estadisticasReferidor(param) {
      let params = {id : param}

      return this.http.post(`estadisticasReferido`, params);
    }
    consultarCodigoActivo(params) {
      // console.log(params)
      return this.http.post(`users/consultarCodigoActivo`, params);
    }

    showCreditoActivo(params) {
      return this.http.post(`financiera/obtenerDetalleCA`,params);
    }

    showCreditoCerrado(params) {
      return this.http.post(`financiera/obtenerDetalleCC`,params);
    }

    showDesembolso(params) {
      return this.http.post(`financiera/getDesembolso`,params);
    }
    updatePago(params) {
      return this.http.post(`financiera/realizarPago`,params);
    }
    cargarFactura(params) {
      return this.http.post(`financiera/cargarFactura`,params);
    }
    updatePagoIntereses(params) {
      return this.http.post(`financiera/editarPagoIntereses`,params);
    }
    updateContratos(params) {
      return this.http.post(`financiera/modificarContratos`,params);
    }
    updateEstatusIntereses(params) {
      return this.http.post(`financiera/modificarEstatusIntereses`,params);
    }
    
    exportFirmados(param,doc,nombre) {
      this.http
      .get(`users/download/${param}/${doc}`, { responseType: 'blob' })
      .subscribe(file => {
        FileSaver.saveAs(file, nombre);
      });
    }
    exportFactura(param) {
        this.http
        .get(`users/downloadFactura/${param}`, { responseType: 'blob' })
        .subscribe(file => {
          FileSaver.saveAs(file, 'factura.pdf');
        });
    }
    createPagoParcial(params) {
      return this.http.post(`financiera/realizarPagoParcial`,params);
    }
    exportFileCA() {
      this.http
      .get(`financiera/exportExcelCA`, { responseType: 'blob' })
      .subscribe(file => {
        FileSaver.saveAs(file, 'CreditosAbiertos');
      });
      }
      exportFileCC() {
        this.http
        .get(`financiera/exportExcelCC`, { responseType: 'blob' })
        .subscribe(file => {
          FileSaver.saveAs(file, 'CreditosCerrados');
        });
        }
}
