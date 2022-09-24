import { Component, OnInit, ChangeDetectorRef, Injectable, ViewChild ,ViewEncapsulation  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule  } from '@angular/forms';
import { CountryService } from '../../shared/services/country.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ComentariosService } from 'app/shared/services/comentarios.service';
import swal from 'sweetalert2';
import { of, from, Observable } from 'rxjs';
import { EvaluacionService } from 'app/shared/services/evaluacion.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sing',
  templateUrl: './sing.component.html',
  styleUrls: ['./sing.component.scss']
})
export class SingComponent implements OnInit {
  cargarte
  cargarte2
  code
  solicitud: any
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private countriesService: CountryService,
    private EvaluacionService:EvaluacionService,
    private toast: ToastrService,
  ) { }

  ngOnInit() {
    this.obtenerDato()
    this.obtenerCodigo()
  }

  obtenerDato(){
    
    let usuario= JSON.parse(localStorage.getItem('user'))
    this.countriesService.getBasica({id:usuario.id}).subscribe(response => {
      this.cargarte=response;
      this.solicitud=JSON.parse(JSON.stringify(this.cargarte)).solicitud[0]
      console.log('aqui esta la response',this.solicitud)
      // console.log('aqui va los datos',this.solicitud[0])
    })
   
  }
  firmar(){
    // console.log('aqui entre',this.solicitud)
      if(this.solicitud.ofertaEnviada==0){
        const confirm = swal.fire({
          title: `Enviar codigo`,
          text: '¿Estas seguro de enviar el codigo?',
          type: 'question',
          showConfirmButton: true,
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Aceptar',
          focusCancel: true,
          customClass: {
            icon: 'icon-class-yellow',
            confirmButton: 'confirm-button-class',
            cancelButton: 'cancel-button-class'
          }
        });
      
        from(confirm).subscribe(r => {
          if (r['value']) {
            let data = {
              "idSolicitud":this.solicitud.id,
              "tipo": this.solicitud.tipoCredito == "m" ? 1 : 2,
              "tipo_monto":0
            }
            this.EvaluacionService.solicitarFirma(data).subscribe((res)=>{
              if (res) {
                this.toast.success("Enviado con exito!");
              }
            },(error)=>{
              console.log(error);
            })
          }
        });

      }
      if(this.solicitud.ofertaEnviada==1){

        const confirm = swal.fire({
          title: `Enviar codigo`,
          text: '¿Estas seguro de enviar el codigo?',
          type: 'question',
          showConfirmButton: true,
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Aceptar',
          focusCancel: true,
          customClass: {
            icon: 'icon-class-yellow',
            confirmButton: 'confirm-button-class',
            cancelButton: 'cancel-button-class'
          }
        });
      
        from(confirm).subscribe(r => {
          if (r['value']) {
            let data = {
              "idSolicitud":this.solicitud.id,
              "tipo": this.solicitud.tipoCredito == "m" ? 1 : 2,
              "tipo_monto":1
            }
            this.EvaluacionService.solicitarFirma(data).subscribe((res)=>{
              if (res) {
                this.toast.success("Enviado con exito!");
              }
            },(error)=>{
              console.log(error);
            })
          }
        });
        
      }
      if(this.solicitud.ofertaEnviada==2){

        const confirm = swal.fire({
          title: `Enviar codigo`,
          text: '¿Estas seguro de enviar el codigo?',
          type: 'question',
          showConfirmButton: true,
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Aceptar',
          focusCancel: true,
          customClass: {
            icon: 'icon-class-yellow',
            confirmButton: 'confirm-button-class',
            cancelButton: 'cancel-button-class'
          }
        });
      
        from(confirm).subscribe(r => {
          if (r['value']) {
            let data = {
              "idSolicitud":this.solicitud.id,
              "tipo": this.solicitud.tipoCredito == "m" ? 1 : 2,
              "tipo_monto":2
            }
            this.EvaluacionService.solicitarFirma(data).subscribe((res)=>{
              if (res) {
                this.toast.success("Enviado con exito!");
              }
            },(error)=>{
              console.log(error);
            })
          }
        });
        
      }
  }

  obtenerCodigo(){
    let usuario= JSON.parse(localStorage.getItem('user'))
    this.countriesService.consultarCodigoActivo({id:usuario.id}).subscribe(response => {
      this.cargarte2=response;
      this.code=JSON.parse(JSON.stringify(this.cargarte2)).codigo
       console.log('aqui va el codigo',this.code)
    })
  }

}
