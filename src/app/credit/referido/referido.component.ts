import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import * as Moment from 'moment';
import {formatCurrency, getCurrencySymbol} from '@angular/common';
import { CountryService } from '../../shared/services/country.service';
import { RequestService } from 'app/shared/services/request.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { registerLocaleData, formatNumber } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { CorreosService } from 'app/shared/services/correos.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { environment } from "../../../environments/environment";

@Component({
  selector: 'app-referido',
  templateUrl: './referido.component.html',
  styleUrls: ['./referido.component.scss']
})
export class ReferidoComponent implements OnInit {
  rutaStorage = environment.apiBase+"/storage/app/public"
  rutaWeb = environment.webUrl
  p=1;
  itemsPerPage = 5;
  creditos;
  form: FormGroup;
  creditoAprobado=[];
  aprobados$: Observable<any[]>;
  usuario
  nombre_completo
  correo
  codigo
  
  submitted=false
  textMessage
  msgHideAndShow:boolean=false;  
  msjSubmit=false
  closeResult: string;
  constructor(
    private toast: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private CorreosService: CorreosService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private _modalService: NgbModal,
    private countriesService: CountryService,
    private requestService: RequestService
  ) {
    this.form = this.fb.group({
      emailp: ['', Validators.required],
      emailenvia: ['', Validators.required],
      id:['', Validators.required],
      datos:[false, Validators.requiredTrue],

    });

   }

  ngOnInit() {
    registerLocaleData(localeEs, 'es');
    this.usuario= JSON.parse(localStorage.getItem('user'))
    this.form.controls['id'].setValue(this.usuario.id);
    this.form.controls['emailenvia'].setValue(this.usuario.email);
    this.nombre_completo=this.usuario.first_name+' '+this.usuario.last_name
    this.correo=this.usuario.email
    this.codigo=this.usuario.codigoReferidor

  }

  get f() { return this.form.controls; }

  add() {
    // this.formBlog.controls['enviadoPor'].setValue(this.usuarioEnvia);
    // if (this.formBlog.valid) {
      this.submitted=true
      if (this.form.invalid) {
        return;
    }
      let d = this.form.value;
      // this.submitted=true
      this.msjSubmit=true
      this.CorreosService.invitar(this.form.value).subscribe(response => {
        if (response) {
          this.submitted=false
      this.msjSubmit=false
          this.toast.success(response['message']);
          // this.router.navigate(['/admin/correos/list']);
        } else {
          this.submitted=false
      this.msjSubmit=false
          this.toast.success('invitacion enviada');
        }
      },(error)=>
      {
        this.submitted=false
      this.msjSubmit=false
        let mensaje =error.error.errors;
        Object.keys(mensaje).forEach(key => {
          console.log(key)
          this.toast.error(mensaje[key][0]);
          console.log(mensaje[key][0])
         });
      });
    // }
  }

  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

   // Text Message   

    textMessageFunc(msgText){  

      this.textMessage=" Copiado correctamente!";  

      this.msgHideAndShow=true;  

      setTimeout(() => {  

        this.textMessage="";  

        this.msgHideAndShow=false;  

      }, 1000);  

      

    }  

/* To copy Text from Textbox */  

copyInputMessage(inputElement) {  

  inputElement.select();  

  document.execCommand('copy');  

  inputElement.setSelectionRange(0, 0);  

  this.textMessageFunc('Text');    
}  

}
