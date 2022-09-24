import { Component, OnInit } from '@angular/core';
import * as Moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import {formatCurrency, getCurrencySymbol} from '@angular/common';
import { CountryService } from '../../shared/services/country.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { registerLocaleData, formatNumber } from '@angular/common';
import localeEs from '@angular/common/locales/es';




@Component({
  selector: 'app-credit-history',
  templateUrl: './credit-history.component.html',
  styleUrls: ['./credit-history.component.scss']
})
export class CreditHistoryComponent implements OnInit {
  p;
  itemsPerPage = '5';
  creditos;
  form: FormGroup;
  rutaActiva: any;
  usuario
  constructor(

    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toast: ToastrService,
    private countriesService: CountryService
  ) {
    this.form = this.fb.group({
      borrower_id: [''],
      page: [1],
      n_page:[10],
     
    });
   }

  ngOnInit() {
    registerLocaleData(localeEs, 'es');
    this.usuario= JSON.parse(localStorage.getItem('user'))

    this.form.controls["borrower_id"].setValue(this.usuario.borrower_id_Fk);
    this.obtenerCreditos();
  

  }

  obtenerCreditos(){
    var idU
    if(this.activatedRoute.snapshot.params.id){
      idU = this.activatedRoute.snapshot.params.id
    }else{
      idU = this.usuario.id
    }
    
    this.countriesService.getHistory({id:idU}).subscribe((res)=>{
       console.log(res);
       this.creditos = JSON.parse(JSON.stringify(res)).data;



    },(error)=>{
      console.log(error);
    })
  }

  exportPDF(){
    var idU
    if(this.activatedRoute.snapshot.params.id){
      idU = this.activatedRoute.snapshot.params.id
    }else{
      idU = this.usuario.id
    }

    this.countriesService.exportHistorico(idU);
}

}
