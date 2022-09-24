import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Observable, from, BehaviorSubject, of } from 'rxjs';
import { ConfigCalculadoraService } from 'app/shared/services/config-calculadora.service';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RolesService } from 'app/shared/services/roles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Ng2ImgMaxService } from 'ng2-img-max';

@Component({
  selector: 'app-config-contra-oferta-list',
  templateUrl: './config-contra-oferta-list.component.html',
  styleUrls: ['./config-contra-oferta-list.component.scss']
})
export class ConfigContraOfertaListComponent implements OnInit {
  pItemsInPage=5
  p=1
  configuraciones2$: Observable<any[]>;
  formConfig: FormGroup;
  configToEdit$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(
    private fb: FormBuilder,
    private rolesService: RolesService,
    private configService: ConfigCalculadoraService,
    private toast: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.configuraciones2$ = this.configService.configuraciones2$;
    this.formConfig = this.fb.group({
      id: [''],
      monto_maximo:['', Validators.required], 
      monto_minimo:['', Validators.required],
      tipo_credito:['', Validators.required],  
    });
   }

   ngOnInit() {

    let param;
    if(this.p)
      { 
        param={page:this.p,per_page:this.pItemsInPage};
      }else{
        param={page:1,per_page:this.pItemsInPage};
      }
    this.loadInitialData(param);
  }
  loadInitialData(params){
    this.configService.getContraofertas(params);
    // console.log('datos',this.configuraciones$);
  }
  add() {
    if (this.formConfig.valid) {
      this.configService.add(this.formConfig.value).subscribe(response => {
        if (response) {
          
          this.toast.success("Datos guardados con exito!");
          this.router.navigate(['/admin/config-contra-oferta/1']);
        } else {
          this.toast.error(JSON.stringify(response));
        }
      },(error)=>
      {
        this.toast.error("Error inesperado!");
      });
    }
  }

  edit() {
    if (this.formConfig.valid) {

      this.configService.updateContraOferta(this.formConfig.value).subscribe(response => {
        if (response) {
          this.toast.success("Datos actualizados con exito!");
          this.router.navigate(['/admin/config-contra-oferta/1']);
        } else {
          this.toast.error("Error inesperado!");
        }
      });
    }
    // console.log(this.formTestimonial.value);
  }
  perPage(pItemsInPage,page){
    this.p = page;
    this.pItemsInPage = pItemsInPage;
    let param={page:this.p,per_page:this.pItemsInPage};
    this.loadInitialData(param);

  }

}
