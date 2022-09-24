import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'app/shared/services/request.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { registerLocaleData, formatNumber } from '@angular/common';
import localeEs from '@angular/common/locales/es';
@Component({
  selector: 'app-pre-approved',
  templateUrl: './pre-approved.component.html',
  styleUrls: ['./pre-approved.component.scss']
})
export class PreApprovedComponent implements OnInit {
  p=1;
  itemsPerPage = 5;
  preaprobados$: Observable<any[]>;
  usuario
  constructor(private toast: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private requestService: RequestService) { 
      this.preaprobados$ = this.requestService.preaprobados$;
    }

    ngOnInit() {
      registerLocaleData(localeEs, 'es');
      this.usuario= JSON.parse(localStorage.getItem('user'))
      let param;
      if(this.p)
        { 
          param={idUser:this.usuario.id,page:this.p,per_page:this.itemsPerPage};
        }else{
          param={idUser:this.usuario.id,page:1,per_page:this.itemsPerPage};
        }
      this.loadInitialData(param);
      // this.obtenerCreditos();
  
    }

    loadInitialData(params){
      this.requestService.getPreAprobados(params);
      console.log(this.preaprobados$);
    }

    perPage(itemsPerPage,page){
      this.p = page;
      this.itemsPerPage = itemsPerPage;
      let param={idUser:this.usuario.id,page:this.p,per_page:this.itemsPerPage};
      this.loadInitialData(param);
  
    }

}
