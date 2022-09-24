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
  selector: 'app-pagar-referido',
  templateUrl: './pagar-referido.component.html',
  styleUrls: ['./pagar-referido.component.scss']
})
export class PagarReferidoComponent implements OnInit {

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
  isAdmin=false
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
      idRegistradorFk:[''],
      referencia:['']

    });
   }

  ngOnInit() {
    this.admin();
    this.Variables()
    this.activatedRoute.params
      .pipe(
        switchMap(params => {
          if (params['id']) {
            this.monto=10000
            this.formBlog.controls['idSolicitudFk'].setValue(params['idSolicitud']); 
            return this.countriesService.getBasica({id:params['id']});
          } else if(params['idUsuario']) {
            this.formBlog.controls['idSolicitudFk'].setValue(params['idSolicitud']); 
            return this.countriesService.getBasica({id:params['idUsuario']});
            
          }else{
            return of(null);
          }

          // if (params['idUsuario']) {
          //   return this.countriesService.getBasica({id:params['idUsuario']});
          // } else {
          //   return of(null);
          // }
        })
      )
      .subscribe(blog => {
        if (blog) {
          console.log("aquui sapo",blog)
          this.blogToEdit$.next(blog[0]);
          this.formBlog.controls['idUserFk'].setValue(JSON.parse(JSON.stringify(blog)).usuario.id);
          this.formBlog.controls['nombres'].setValue(JSON.parse(JSON.stringify(blog)).usuario.first_name+' '+JSON.parse(JSON.stringify(blog)).usuario.second_name+' '+JSON.parse(JSON.stringify(blog)).usuario.last_name+' '+JSON.parse(JSON.stringify(blog)).usuario.second_last_name);
          this.formBlog.controls['ncedula'].setValue(JSON.parse(JSON.stringify(blog)).usuario.n_document);
          this.formBlog.controls['email'].setValue(JSON.parse(JSON.stringify(blog)).usuario.email);
          this.formBlog.controls['nombreBanco'].setValue(JSON.parse(JSON.stringify(blog)).financiera.banco);
          this.formBlog.controls['tipoCuenta'].setValue(JSON.parse(JSON.stringify(blog)).financiera.tipoCuenta);
          this.formBlog.controls['ncuenta'].setValue(JSON.parse(JSON.stringify(blog)).financiera.nCuenta);
          // this.formBlog.controls['monto'].setValue(this.monto);
          this.Ingresos_totales_mensuales('10000')
          this.formBlog.controls['metodo'].setValue('Transferencia bancaria');
          // this.formBlog.controls['idSolicitudFk'].setValue(JSON.parse(JSON.stringify(blog)).solicitud[0].id);
          this.formBlog.controls['registrador'].setValue(JSON.parse(localStorage.getItem('user')).first_name+' '+JSON.parse(localStorage.getItem('user')).last_name);
          this.formBlog.controls['idRegistradorFk'].setValue(JSON.parse(localStorage.getItem('user')).id);
          console.log("aquui blog",this.formBlog.value)
        }
      });
  }
  
  add() {
    if (this.formBlog.valid) {
      let d = this.formBlog.value;
 
      this.AtributosService.addDesembolsoReferidor(this.formBlog.value).subscribe(response => {
        if (response) {
          
          this.toast.success(response['message']);
          this.router.navigate(['/admin/users/list-referidos']);
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

admin(){

  const roles = localStorage.getItem('roles');
  
  if (roles.trim()=='Administrador') {
    console.log(roles);
    this.isAdmin=true;
  }else{
    this.isAdmin=false;
  }
  

}
}
