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
  selector: 'app-approved',
  templateUrl: './approved.component.html',
  styleUrls: ['./approved.component.scss']
})
export class ApprovedComponent implements OnInit {
  p=1;
  itemsPerPage = 5;
  creditos;
  form: FormGroup;
  creditoAprobado=[];
  filterParams
  country$:Observable<any[]>;
  aprobados$: Observable<any[]>;
  usuario
  contraOfertaForm: FormGroup;
  tablaContraOferta
  interesMoratorio = Math.pow(1+(22/100), (1/360))-1
  constructor(private toast: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private countriesService: CountryService,
    private requestService: RequestService,
    private auth : AuthService,) { 
      this.country$ = this.countriesService.creditosUsuarios$;
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
    console.log("CAL=>",this.interesMoratorio);
    let param;
    if(this.p)
      { 
        param={page:this.p,per_page:this.itemsPerPage,idUser:this.usuario.id};
      }else{
        param={page:1,per_page:this.itemsPerPage,idUser:this.usuario.id};
      }
    this.loadInitialData(param);
    
    // this.obtenerCreditos();

  }

  loadInitialData(params){
    
    this.countriesService.obtenerCreditosAbiertosUsuario(params);
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
            res['data'][index]['cuota']= element.totalPagar/element.plazo
          }else{
            res['data'][index]['fechaPago'] = Moment(element.fechaDesembolso).add(element.plazo, 'days').format('YYYY-MM-DD');
            res['data'][index]['fechaPagoProxima'] = "No incluye";
            res['data'][index]['cuota']= 0
          }
          if(element.estatus == 'negado'){
            res['data'][index]['estatus_final']= 'Negado';
          }else if(element.Evaluacion!=''){
            console.log('culo')
            if(element.Evaluacion.estatus!='aprobado' && element.ofertaEnviada==null){
              res['data'][index]['estatus_final']= 'En evaluacion';
            }else if(element.Evaluacion.estatus=='aprobado' && element.ofertaEnviada!=null && element.estatus_firma=='pendiente'){
              res['data'][index]['estatus_final']= 'Pendiente firma';
            }else if(element.Evaluacion.estatus=='aprobado' && element.ofertaEnviada!=null && element.estatus_firma!='pendiente' && element.estatus!='abierto'){
              res['data'][index]['estatus_final']= 'Pendiente desembolso';
            }

          }else{
            res['data'][index]['estatus_final']= 'Pendiente evaluacion';
          }
          
        });
        console.log('termino', this.country$);
      }
    })
 
  }


  perPage(itemsPerPage,page){
    this.p = page;
    this.itemsPerPage = itemsPerPage;
    let param={idUser:this.usuario.id,page:this.p,per_page:this.itemsPerPage};
    this.loadInitialData(param);

  }
 

  onFilter(filterParams) {
  
    console.log(filterParams)
    this.filterParams = filterParams
    this.p=1
    this.loadInitialData({idUser:this.usuario.id,page:1,per_page:this.itemsPerPage, ...filterParams})
    // this.countriesService.obtenerCreditosAbiertosUsuario(filterParams);
  }
  
}
