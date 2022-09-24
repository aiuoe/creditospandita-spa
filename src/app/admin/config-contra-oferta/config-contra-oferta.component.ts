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
  selector: 'app-config-contra-oferta',
  templateUrl: './config-contra-oferta.component.html',
  styleUrls: ['./config-contra-oferta.component.scss']
})
export class ConfigContraOfertaComponent implements OnInit {
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
      monto_maximo:['', Validators.required], 
      monto_minimo:['', Validators.required],
       
    });
   }

   ngOnInit() {
    this.activatedRoute.params
      .pipe(
        switchMap(params => {
          if (params['id']) {
            return this.configService.showContraOferta(params['id']);
          } else {
            return of(null);
          }
        })
      )
      .subscribe(config => {
        if (config) {
          this.configToEdit$.next(config);
          this.formConfig.controls['id'].setValue(config['id']);
          this.formConfig.controls['monto_maximo'].setValue(config['monto_maximo']);
          this.formConfig.controls['monto_minimo'].setValue(config['monto_minimo']);
          console.log("aquui",this.formConfig.value) 
        }
      });
  }

  add() {
    if (this.formConfig.valid) {
      this.configService.add(this.formConfig.value).subscribe(response => {
        if (response) {
          
          this.toast.success("Datos guardados con exito!");
          this.router.navigate(['/admin/config-contra-oferta/list']);
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
          this.router.navigate(['/admin/contraofert/list']);
        } else {
          this.toast.error("Error inesperado!");
        }
      });
    }
    // console.log(this.formTestimonial.value);
  }


}
