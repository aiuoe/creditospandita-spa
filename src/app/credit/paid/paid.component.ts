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
  selector: 'app-paid',
  templateUrl: './paid.component.html',
  styleUrls: ['./paid.component.scss']
})
export class PaidComponent implements OnInit {
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
      this.country$ = this.countriesService.creditosPagadosUsuarios$;
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

    console.log("CAL=>",this.interesMoratorio);
    let param;
    if(this.p)
      { 
        param={page:this.p,per_page:this.itemsPerPage,idUser:this.usuario.id};
      }else{
        param={page:1,per_page:this.itemsPerPage,idUser:this.usuario.id};
      }
    this.loadInitialData(param);

  }

  loadInitialData(params){
    
    this.countriesService.obtenerCreditosPagadosPorUsuario(params);
    // this.country$.subscribe((res)=>{
    //   console.log('respuesta',res)
      
    //   if(res['data']){
    //     let creditos = JSON.parse(JSON.stringify(res))
    //     creditos.data.forEach((element,index) => {
    //       console.log('item',element);
          
    //     });
    //     console.log('termino', this.country$);
    //   }
    // })
 
  }


  perPage(itemsPerPage,page){
    this.p = page;
    this.itemsPerPage = itemsPerPage;
    let param={idUser:this.usuario.id,page:this.p,per_page:this.itemsPerPage,...this.filterParams};
    this.loadInitialData(param);

  }
 

  onFilter(filterParams) {
  
    console.log(filterParams)
    this.filterParams=filterParams
    this.p=1
    this.loadInitialData({idUser:this.usuario.id,page:1,per_page:this.itemsPerPage, ...filterParams})
    // this.countriesService.obtenerCreditosAbiertosUsuario(filterParams);
  }

  descargarFactura(id){
    this.countriesService.exportFactura(id);
  }
}
