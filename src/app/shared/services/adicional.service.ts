import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import * as FileSaver from 'file-saver';
@Injectable({
  providedIn: 'root'
})
export class AdicionalService {

  blogs$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  constructor(private http: HttpClient) {
  }

  get(params) {
    this.http.post<any[]>(`adicional/get`, params ).subscribe(blogs => {
      this.blogs$.next(blogs);
    });
  }

  show(index: number) {
    let params = {id : index}
    return this.http.post(`adicional/getAtributo`, params);
  }

  add(params) {
    return this.http.post(`adicional/create`, params);
  }

  update(params) {
    return this.http.post(`adicional/update`, params);
  }

  delete(id) {
    let params = {id : id}
    return this.http.post(`adicional/delete`,params);
  }
  exportFile(data) {
    // Para Probar
    this.http
      .post(`adicional/file/export`,data, { responseType: 'blob' })
      .subscribe(file => {
        FileSaver.saveAs(file, data.file);
      });
  }
}
