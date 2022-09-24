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
  selector: 'app-creditoabierto',
  templateUrl: './creditoabierto.component.html',
  styleUrls: ['./creditoabierto.component.scss']
})
export class CreditoabiertoComponent implements OnInit {

  p=1;
  itemsPerPage = 5;
  creditos;
  form: FormGroup;
  creditoAprobado=[];
  country$:Observable<any[]>;
  aprobados$: Observable<any[]>;
  usuario
  contraOfertaForm: FormGroup;
  tablaContraOferta
  interesMoratorio = Math.pow(1+(22/100), (1/360))-1
  filterParams
  estatus = 'abierto'
  hastaMora =''
  desdeMora=''
  constructor(private toast: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private countriesService: CountryService,
    private requestService: RequestService,
    private auth : AuthService,) { 
      this.country$ = this.countriesService.country$;
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
    this.desdeMora ='';
    this.hastaMora ='';
    // if(!this.auth.isAdmin()){
    //   this.obtenerContraoferta(JSON.parse(localStorage.getItem('user')).id);
    // }
    // this.form.controls["borrower_id"].setValue(this.usuario.borrower_id_Fk);
    console.log("CAL=>",this.interesMoratorio);
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
    
    this.countriesService.obtenerCreditosAbiertos(params);
    this.country$.subscribe((res)=>{
      console.log('respuesta',res)
      
      if(res['data']){
        let creditos = JSON.parse(JSON.stringify(res))
        creditos.data.forEach((element,index) => {
          console.log('item',element);
          if(element.tipoCredito == 'm'){
            let dateAct = Moment().format("YYYY-MM-DD");
            let fp= Moment(element.fechaDesembolso).add(element.plazo, 'months').format('YYYY-MM-DD');
            res['data'][index]['fechaPago'] = Moment(element.fechaDesembolso).add(element.plazo, 'months').format('YYYY-MM-DD');
            res['data'][index]['fechaPagoProxima'] = Moment(element.fechaDesembolso).add(1, 'months').format('YYYY-MM-DD');
            if(element.ofertaEnviada == 2){
              res['data'][index]['cuota']= element.totalPagar/element.plazo
            }else{
              res['data'][index]['cuota']= element.ContraOferta.totalPagar/element.plazo
            }
            
          }else{
            res['data'][index]['fechaPago'] = Moment(element.fechaDesembolso).add(element.plazo, 'days').format('YYYY-MM-DD');
            res['data'][index]['fechaPagoProxima'] = "No incluye";
            res['data'][index]['cuota']= 0
          }
          
        });
        console.log('termino', this.country$);
      }
    })
 
  }

  obtenerCreditos(){
  
    // this.countriesService.obtenerCreditosAbiertos(this.form.value).subscribe((res)=>{
    //    console.log(res);
    //    this.creditos = JSON.parse(JSON.stringify(res)).data;

    // //    this.creditos .forEach(obj => {
    // //     if(obj.loan_status_id=='1'){
    // //       this.creditoAprobado.push(obj)
    // //     }
         
      
    // // });
    // console.log('arreglou',this.creditoAprobado)


    // },(error)=>{
    //   console.log(error);
    // })
  }
  perPage(itemsPerPage,page){
    this.p = page;
    this.itemsPerPage = itemsPerPage;
    let param={page:this.p,per_page:this.itemsPerPage,estatus:this.estatus,desdeMora:this.desdeMora,hastaMora:this.hastaMora,...this.filterParams};
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
    console.log('filter params', filterParams);
    this.filterParams = filterParams
    this.p=1
    this.loadInitialData({page:1,per_page:this.itemsPerPage,estatus:this.estatus,desdeMora:this.desdeMora,hastaMora:this.hastaMora, ...filterParams})
  }
  
  export(){
    this.countriesService.exportFileCA();
}
cambioestatus(estatus){
  this.estatus=estatus
  this.p=1;
  console.log('aqui el dato',estatus)
  if(this.estatus !="moroso" && this.estatus !="pendiente de novacion"){
    this.desdeMora = '';
    this.hastaMora = '';
  }
  this.loadInitialData({page:1,per_page:this.itemsPerPage,estatus:this.estatus,desdeMora:this.desdeMora,hastaMora:this.hastaMora,...this.filterParams})
}
}
