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
import { AuthService } from '../../shared/auth/auth.service';

@Component({
  selector: 'app-creditoproceso',
  templateUrl: './creditoproceso.component.html',
  styleUrls: ['./creditoproceso.component.scss']
})
export class CreditoprocesoComponent implements OnInit {

  p=1;
  itemsPerPage = 5;
  creditos;
  form: FormGroup;
  creditoAprobado=[];
  aprobados$: Observable<any[]>;
  usuario
  contraOfertaForm: FormGroup;
  tablaContraOferta
  filterParams
  constructor(private toast: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private countriesService: CountryService,
    private requestService: RequestService,
    private auth : AuthService,) { 
      this.aprobados$ = this.requestService.aprobados$;
      this.form = this.fb.group({
        borrower_id: [''],
        page: [1],
        n_page:[10],
       
      });
      this.contraOfertaForm = this.fb.group({
        id:[''],
        fechaAceptado:['', Validators.required],
        fechaN:['', Validators.required],
        estatus:['aceptado']
  
      });
      
    }

  ngOnInit() {
    registerLocaleData(localeEs, 'es');
    this.usuario= JSON.parse(localStorage.getItem('user'))
    // if(!this.auth.isAdmin()){
    //   this.obtenerContraoferta(JSON.parse(localStorage.getItem('user')).id);
    // }
    // this.form.controls["borrower_id"].setValue(this.usuario.borrower_id_Fk);
    // let param;
    // if(this.p)
    //   { 
    //     param={page:this.p,per_page:this.itemsPerPage};
    //   }else{
    //     param={page:1,per_page:this.itemsPerPage};
    //   }
    // this.loadInitialData(param);
    
    // this.obtenerCreditos();

  }

  loadInitialData(params){
    let testing
    testing= this.requestService.getCreditos(params);
    console.log('aqui vamos',testing);
  }

  obtenerCreditos(){
  
    this.countriesService.getHistory(this.form.value).subscribe((res)=>{
       console.log(res);
       this.creditos = JSON.parse(JSON.stringify(res)).data;

       this.creditos .forEach(obj => {
        if(obj.loan_status_id=='1'){
          this.creditoAprobado.push(obj)
        }
         
      
    });
    console.log('arreglou',this.creditoAprobado)


    },(error)=>{
      console.log(error);
    })
  }
  perPage(itemsPerPage,page){
    this.p = page;
    this.itemsPerPage = itemsPerPage;
    let param={page:this.p,per_page:this.itemsPerPage,...this.filterParams};
    this.loadInitialData(param);

  }
  obtenerContraoferta(params){
    // let respuesta;
    // respuesta=this.requestService.consultaContraoferta(params);
    // console.log("respuesta",respuesta);


    this.requestService.consultaContraoferta(params).subscribe(response => {
      if (response) {
        console.log("resultado",JSON.parse(JSON.stringify(response)).total)
        if(JSON.parse(JSON.stringify(response)).total==1){
          
          let contraOferta = JSON.parse(JSON.stringify(response)).data;
          this.contraOfertaForm.controls['id'].setValue(contraOferta.id);
          let montoSolicitado = formatNumber(contraOferta.montoSolicitado, 'es')
          let montoAprobado = formatNumber(contraOferta.montoAprobado, 'es')
          let tasaInteres = formatNumber(contraOferta.tasaInteres, 'es')
          let subtotal = formatNumber(contraOferta.subtotal, 'es')
          let plataforma = formatNumber(contraOferta.plataforma, 'es')
          let aprobacionRapida = formatNumber(contraOferta.aprobacionRapida, 'es')
          let iva = formatNumber(contraOferta.iva, 'es')
          let totalPagar = formatNumber(contraOferta.totalPagar, 'es')
          this.tablaContraOferta = '<div class="row"><div class="col-md-12" style="margin:auto;"><table class="table table-bordered table-striped"><tbody><tr><th>Monto Solicitado</th><td>$ '+montoSolicitado+'</td></tr><tr><th>Monto Aprobado</th><td>$ '+montoAprobado+'</td></tr><tr><th>Tasa de interes</th><td>$ '+tasaInteres+'</td></tr><tr><th>Subtotal</th><td>$ '+subtotal+'</td></tr><tr><th>Plataforma</th><td>$ '+plataforma+'</td></tr><tr><th>Aprobación rapida</th><td>$ '+aprobacionRapida+'</td></tr><tr><th>IVA</th><td>$ '+iva+'</td></tr><tr><th>Total a pagar</th><td>$ '+totalPagar+'</td></tr></tbody></table></div></div>'
          // this.open();
          // let el = document.getElementById("menutito");
          // let cont =document.getElementById("contenedorte");
          // let cont2 =document.getElementById("contenedorte2");
          // let fondo =document.getElementById("fondo");
          // let menu23 =document.getElementById("menu23");
          // let menutito2 =document.getElementById("menutito2");
          // el.classList.add("ocultando")
          // cont.classList.add("padn0")
          // cont2.classList.add("padn0")
          // fondo.classList.add("fondoBlanco")
          // menu23.classList.add("fondoBlanco2")
          // menutito2.classList.remove('ocultando');
          // // console.log("nohay",el)
          // this.router.navigate(['/credit/contra-ofertas']);
        }else{
          
          // let el = document.getElementById("menutito");
          // let cont =document.getElementById("contenedorte");
          // let cont2 =document.getElementById("contenedorte2");
          // let fondo =document.getElementById("fondo");
          // let menu23 =document.getElementById("menu23");
          // let menutito2 =document.getElementById("menutito2");
          // cont2.classList.remove("padn0")
          // cont.classList.remove("padn0")
          // fondo.classList.remove("fondoBlanco")
          // el.classList.remove('ocultando');
          // menu23.classList.remove("fondoBlanco2")
          // menutito2.classList.add('ocultando');
        }
        // this.toast.success("Datos guardados con exito!");
        // this.router.navigate(['/admin/evaluacion/',this.activatedRoute.snapshot.params.evaluacion]);
      } else {
        console.log("no hay respuesta");
      }
    },(error)=>
    {
      // this.toast.error("Error inesperado!");
      console.log("error");
    });
  }

  onFilter(filterParams) {
    console.log(filterParams)
    this.p=1;
    this.filterParams = filterParams;
    this.loadInitialData({page:1,per_page:this.itemsPerPage, ...filterParams})
  }
  

}
