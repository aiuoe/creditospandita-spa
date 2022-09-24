import { Component, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { EvaluacionService } from 'app/shared/services/evaluacion.service';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-evaluacion',
  templateUrl: './evaluacion.component.html',
  styleUrls: ['./evaluacion.component.scss']
})
export class EvaluacionComponent implements OnInit {
  formConfig: FormGroup;
  pItemsInPage=5
  p=1
  estatus='aprobado'
  configuraciones$: Observable<any[]>;
  filterParams
  evalua =false
  constructor(private EvaluacionService: EvaluacionService, 
    private toast: ToastrService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,) {
      this.configuraciones$ = this.EvaluacionService.configuraciones$;
      this.formConfig = this.fb.group({
        idSolicitudFk: ['', Validators.required],
        idUserFk:['', Validators.required],
        estatus:['verificacion de selfie']
      });
     }

  ngOnInit() {
    registerLocaleData(localeEs, 'es');
    // let param;
    // if(this.p)
    //   { 
    //     param={page:this.p,per_page:this.pItemsInPage,estatus:this.estatus};
    //   }else{
    //     param={page:1,per_page:this.pItemsInPage,estatus:this.estatus};
    //   }
    // this.loadInitialData(param);
  }

  loadInitialData(params){
    this.EvaluacionService.get(params);
    console.log(this.configuraciones$);
  }
 delete(configuracion: any) {
    const confirm = swal.fire({
      title: `Borrar la configuracion`,
      text: 'Esta acción no se puede deshacer',
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Borrar',
      focusCancel: true
    });

    from(confirm).subscribe(r => {
      if (r['value']) {
        this.EvaluacionService.delete(configuracion.id).subscribe(response => {
          if (response) {
            this.toast.success("Dato eliminado con exito!");
            this.p=1;
            this.loadInitialData({page:1,per_page:this.pItemsInPage,estatus:this.estatus, ...this.filterParams})
          } else {
            this.toast.error("Error inesperado!");
          }
        });
      }
    });
  }
  perPage(pItemsInPage,page){
    this.p = page;
    this.pItemsInPage = pItemsInPage;
    let param={page:this.p,per_page:this.pItemsInPage,estatus:this.estatus, ...this.filterParams};
    this.loadInitialData(param);

  }

  evaluar(evaluacion){
    console.log(evaluacion)
    this.formConfig.controls['idSolicitudFk'].setValue(evaluacion.id_solicitud);
    this.formConfig.controls['idUserFk'].setValue(evaluacion.id_usuario);
    if(!evaluacion.id_evaluacion || evaluacion.id_evaluacion == null){
      this.evalua =true
      if (this.formConfig.valid) {
        this.EvaluacionService.add(this.formConfig.value).subscribe(response => {
          this.evalua =false
          if (response) {
            let e = JSON.parse(JSON.stringify(response))
            this.toast.success("Iniciando Evaluacion");
            this.router.navigate(['/admin/evaluacion/', e.id]);
          } else {
            this.toast.error(JSON.stringify(response));
          }
        },(error)=>
        {
          this.evalua =false
          this.toast.error("Error inesperado!");
        });
      }
    }else{
      this.router.navigate(['/admin/evaluacion/',evaluacion.id_evaluacion]);
    }
    
  }

  onFilter(filterParams) {
    console.log('aqui el dato',filterParams)
    this.filterParams = filterParams
    this.p=1;
    this.loadInitialData({page:1,per_page:this.pItemsInPage,estatus:this.estatus, ...filterParams})
  }

  cambioestatus(estatus){
    this.estatus=estatus
    this.p=1;
    console.log('aqui el dato',estatus)
    this.loadInitialData({page:1,per_page:this.pItemsInPage,estatus:this.estatus,...this.filterParams})
  }
  export(){
    this.EvaluacionService.exportFileEvaluaciones();
}

}
