import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RolesService } from 'app/shared/services/roles.service';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { AtributosService } from 'app/shared/services/atributos.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { VariablesService } from 'app/shared/services/variables.service';
import { switchMap } from 'rxjs/operators';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { environment } from "../../../environments/environment";
import { CountryService } from '../../shared/services/country.service';
import {formatCurrency, getCurrencySymbol} from '@angular/common';

@Component({
  selector: 'app-desembolsar',
  templateUrl: './desembolsar.component.html',
  styleUrls: ['./desembolsar.component.scss']
})
export class DesembolsarComponent implements OnInit {

  formBlog: FormGroup;
  page=1;
  variables;
  per_page=30;
  blogToEdit$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  imagen
  nombreImagen
  urlImagen
  monto
  cantidad
  ruta = environment.webUrl
  clientSelectConfig = {
    searchPlaceholder: 'Buscar',
    noResultsFound: 'Sin resultados',
    placeholder: 'Seleccione',
    displayKey: 'variable',
    searchOnKey: 'variable',
    search: true,
    moreText: 'más'
  };
  solicitud

  constructor(
    private fb: FormBuilder,
    private rolesService: RolesService,
    private AtributosService: AtributosService,
    private VariablesService: VariablesService,
    private toast: ToastrService,
    private countriesService: CountryService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
  ) {
    this.formBlog = this.fb.group({
      idUserFk: [''],
      nombres: ['',],
      ncedula: ['',],
      email: ['',],
      nombreBanco:[''],
      tipoCuenta:[''],
      ncuenta:[''],
      monto:[''],
      metodo:[''],
      idSolicitudFk:[''],
      registrador:[''],
      comentario:[''],
      idRegistradorFk:['']

    });
   }

  ngOnInit() {
    this.Variables()
    this.activatedRoute.params
      .pipe(
        switchMap(params => {
          if (params['id']) {
            this.monto=params['monto']
            return this.countriesService.getBasica({id:params['id']});
          } else {
            return of(null);
          }
        })
      )
      .subscribe(blog => {
        if (blog) {
          console.log("aquui sapo",JSON.parse(JSON.stringify(blog)).solicitud[0].id)
          this.blogToEdit$.next(blog[0]);
          this.solicitud =JSON.parse(JSON.stringify(blog)).solicitud[0]
          this.formBlog.controls['idUserFk'].setValue(JSON.parse(JSON.stringify(blog)).usuario.id);
          this.formBlog.controls['nombres'].setValue(JSON.parse(JSON.stringify(blog)).usuario.first_name+' '+JSON.parse(JSON.stringify(blog)).usuario.second_name+' '+JSON.parse(JSON.stringify(blog)).usuario.last_name+' '+JSON.parse(JSON.stringify(blog)).usuario.second_last_name);
          this.formBlog.controls['ncedula'].setValue(JSON.parse(JSON.stringify(blog)).usuario.n_document);
          this.formBlog.controls['email'].setValue(JSON.parse(JSON.stringify(blog)).usuario.email);
          this.formBlog.controls['nombreBanco'].setValue(JSON.parse(JSON.stringify(blog)).financiera.banco);
          this.formBlog.controls['tipoCuenta'].setValue(JSON.parse(JSON.stringify(blog)).financiera.tipoCuenta);
          this.formBlog.controls['ncuenta'].setValue(JSON.parse(JSON.stringify(blog)).financiera.nCuenta);
          // this.formBlog.controls['monto'].setValue(this.monto);
          this.Ingresos_totales_mensuales(this.monto)
          this.formBlog.controls['metodo'].setValue('Transferencia bancaria');
          this.formBlog.controls['idSolicitudFk'].setValue(JSON.parse(JSON.stringify(blog)).solicitud[0].id);
          this.formBlog.controls['registrador'].setValue(JSON.parse(localStorage.getItem('user')).first_name+' '+JSON.parse(localStorage.getItem('user')).last_name);
          this.formBlog.controls['idRegistradorFk'].setValue(JSON.parse(localStorage.getItem('user')).id);

        }
      });
  }
  
  add() {
    if (this.formBlog.valid) {
      let d = this.formBlog.value;
 
      this.AtributosService.addDesembolso(this.formBlog.value).subscribe(response => {
        if (response) {
          if(this.solicitud.codCampaign){
            this.AtributosService.enviarCampCorrecta(this.solicitud.id,this.solicitud.codCampaign).subscribe(res=>{
            console.log('Campaing',res)
            },error=>{
              console.log('Campaing',error)
            });
          }
          this.toast.success(response['message']);
          this.router.navigate(['/admin/creditoproceso']);
        } else {
          this.toast.error(JSON.stringify(response));
        }
      },(error)=>
      {
        let mensaje =error.error.errors;
        Object.keys(mensaje).forEach(key => {
          console.log(key)
          this.toast.error(mensaje[key][0]);
          console.log(mensaje[key][0])
         });
      });
    }
  }

  edit() {
    if (this.formBlog.valid) {
      let d = this.formBlog.value;
  
      this.AtributosService.update(this.formBlog.value).subscribe(response => {
        if (response) {
          this.toast.success(response['message']);
          this.router.navigate(['/admin/atributos/list']);
        } else {
          this.toast.error(JSON.stringify(response));
        }
      });
    }
    // console.log(this.formBlog.value);
  }

  clientSelected(country) {
    if (country) {
 
      this.formBlog.controls['variable'].setValue(country['variable']);
      console.log(this.formBlog.value)
    }
  }
  Variables(){
    
      // console.log("countries",res);
     

      this.VariablesService.get2().subscribe((res)=>{
       console.log("variables",JSON.parse(JSON.stringify(res)).blog);
        this.variables = JSON.parse(JSON.stringify(res)).blog;
      },(error)=>{
        console.log(error);
      })
    
  }

  Ingresos_totales_mensuales(value: string) {
    // ing_mensuales
    this.formBlog.controls['monto'].setValue(value);

    let val = parseInt(value, 10);
    if (Number.isNaN(val)) {
      
      val = 0;
    }

    
    this.cantidad = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
    console.log('primera funcion',this.cantidad)
}
}
