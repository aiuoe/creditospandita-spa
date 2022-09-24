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
  selector: 'app-ingreso-actividad-add',
  templateUrl: './ingreso-actividad-add.component.html',
  styleUrls: ['./ingreso-actividad-add.component.scss']
})
export class IngresoActividadAddComponent implements OnInit {
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
    this.formConfig = this.fb.group({
      id: [''],
      nombre:['', Validators.required], 
      puntaje:['', Validators.required]
    });
   }

   ngOnInit() {
    this.activatedRoute.params
      .pipe(
        switchMap(params => {
          if (params['id']) {
            return this.configService.showIngreso(params['id']);
          } else {
            return of(null);
          }
        })
      )
      .subscribe(config => {
        if (config) {
          this.configToEdit$.next(config);
          this.formConfig.controls['id'].setValue(config['id']);
          this.formConfig.controls['nombre'].setValue(config['nombre']);
          this.formConfig.controls['puntaje'].setValue(config['puntaje']);
          console.log("aquui",this.formConfig.value)
        }
      });
  }

  add() {
    if (this.formConfig.valid) {
      this.configService.addIngreso(this.formConfig.value).subscribe(response => {
        if (response) {
          
          this.toast.success("Datos guardados con exito!");
          this.router.navigate(['/admin/ingreso-actividad/list']);
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

      this.configService.updateIngreso(this.formConfig.value).subscribe(response => {
        if (response) {
          this.toast.success("Datos actualizados con exito!");
          this.router.navigate(['/admin/ingreso-actividad/list']);
        } else {
          this.toast.error("Error inesperado!");
        }
      });
    }
    // console.log(this.formTestimonial.value);
  }


}
