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
  selector: 'app-cannon-alojamiento-add',
  templateUrl: './cannon-alojamiento-add.component.html',
  styleUrls: ['./cannon-alojamiento-add.component.scss']
})
export class CannonAlojamientoAddComponent implements OnInit {
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
      estrato:['', Validators.required], 
      alojamiento:['', Validators.required], 
      monto:['', Validators.required]
    });
   }

   ngOnInit() {
    this.activatedRoute.params
      .pipe(
        switchMap(params => {
          if (params['id']) {
            return this.configService.showCannon(params['id']);
          } else {
            return of(null);
          }
        })
      )
      .subscribe(config => {
        if (config) {
          this.configToEdit$.next(config);
          this.formConfig.controls['id'].setValue(config['id']);
          this.formConfig.controls['estrato'].setValue(config['estrato']);
          this.formConfig.controls['alojamiento'].setValue(config['alojamiento']);
          this.formConfig.controls['monto'].setValue(config['monto']);
          console.log("aquui",this.formConfig.value)
        }
      });
  }

  add() {
    if (this.formConfig.valid) {
      this.configService.addCannon(this.formConfig.value).subscribe(response => {
        if (response) {
          
          this.toast.success("Datos guardados con exito!");
          this.router.navigate(['/admin/cannonAlojamiento/lista']);
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

      this.configService.updateCannon(this.formConfig.value).subscribe(response => {
        if (response) {
          this.toast.success("Datos actualizados con exito!");
          this.router.navigate(['/admin/cannonAlojamiento/lista']);
        } else {
          this.toast.error("Error inesperado!");
        }
      });
    }
    // console.log(this.formTestimonial.value);
  }


}
