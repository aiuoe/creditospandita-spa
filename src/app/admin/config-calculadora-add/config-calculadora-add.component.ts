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
  selector: 'app-config-calculadora-add',
  templateUrl: './config-calculadora-add.component.html',
  styleUrls: ['./config-calculadora-add.component.scss']
})
export class ConfigCalculadoraAddComponent implements OnInit {
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
      monto_minimo:['', Validators.required], 
      monto_maximo:['', Validators.required], 
      dias_minimo:['', Validators.required], 
      dias_maximo:['', Validators.required], 
      monto_restriccion:['', Validators.required],
      dias_restriccion:['', Validators.required],
      porcentaje_iva:['', Validators.required],
      porcentaje_plataforma:['', Validators.required],
      porcentaje_express:['', Validators.required],
      porcentaje_express_dos:['', Validators.required],
      porcentaje_express_tres:['', Validators.required],
      monto_restriccion_tooltip:['', Validators.required],
      tasa:['', Validators.required],
      tipo:['',Validators.required]
    });
  }

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        switchMap(params => {
          if (params['id']) {
            return this.configService.show(params['id']);
          } else {
            return of(null);
          }
        })
      )
      .subscribe(config => {
        if (config) {
          this.configToEdit$.next(config);
          this.formConfig.controls['id'].setValue(config['id']);
          this.formConfig.controls['monto_minimo'].setValue(config['monto_minimo']);
          this.formConfig.controls['monto_maximo'].setValue(config['monto_maximo']);
          this.formConfig.controls['dias_minimo'].setValue(config['dias_minimo']);
          this.formConfig.controls['dias_maximo'].setValue(config['dias_maximo']);
          this.formConfig.controls['monto_restriccion'].setValue(config['monto_restriccion']);
          this.formConfig.controls['dias_restriccion'].setValue(config['dias_restriccion']);
          this.formConfig.controls['porcentaje_iva'].setValue(config['porcentaje_iva']);
          this.formConfig.controls['porcentaje_plataforma'].setValue(config['porcentaje_plataforma']);
          this.formConfig.controls['porcentaje_express'].setValue(config['porcentaje_express']);
          this.formConfig.controls['porcentaje_express_dos'].setValue(config['porcentaje_express_dos']);
          this.formConfig.controls['porcentaje_express_tres'].setValue(config['porcentaje_express_tres']);
          this.formConfig.controls['tipo'].setValue(config['tipo']);
          this.formConfig.controls['monto_restriccion_tooltip'].setValue(config['monto_restriccion_tooltip']);
          this.formConfig.controls['tasa'].setValue(config['tasa']);
          console.log("aquui",this.formConfig.value)
        }
      });
  }

  add() {
    if (this.formConfig.valid) {
      this.configService.add(this.formConfig.value).subscribe(response => {
        if (response) {
          
          this.toast.success("Datos guardados con exito!");
          this.router.navigate(['/admin/config-calculadora/list']);
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

      this.configService.update(this.formConfig.value).subscribe(response => {
        if (response) {
          this.toast.success("Datos actualizados con exito!");
          this.router.navigate(['/admin/config-calculadora/list']);
        } else {
          this.toast.error("Error inesperado!");
        }
      });
    }
    // console.log(this.formTestimonial.value);
  }

}
