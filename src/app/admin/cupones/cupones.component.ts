import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RolesService } from 'app/shared/services/roles.service';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { FiltradoService } from 'app/shared/services/filtrado.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { VariablesService } from 'app/shared/services/variables.service';
import { switchMap } from 'rxjs/operators';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { environment } from "../../../environments/environment";

@Component({
  selector: 'app-cupones',
  templateUrl: './cupones.component.html',
  styleUrls: ['./cupones.component.scss']
})
export class CuponesComponent implements OnInit {

  formBlog: FormGroup;
  page=1;
  variables;
  per_page=30;
  blogToEdit$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  imagen
  nombreImagen
  urlImagen
  editar=0;
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

  constructor(
    private fb: FormBuilder,
    private rolesService: RolesService,
    private FiltradoService: FiltradoService,
    private VariablesService: VariablesService,
    private toast: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
  ) {
    this.formBlog = this.fb.group({
      id: [''],
      valor: ['', Validators.required],
      nombre: ['', Validators.required],
      desde: [''],
      hasta: [''],
   
 

    });
   }

  ngOnInit() {
    this.Variables()
    this.activatedRoute.params
      .pipe(
        switchMap(params => {
          if (params['id']) {
            this.editar=1;
            return this.FiltradoService.show(params['id']);
          } else {
            return of(null);
          }
        })
      )
      .subscribe(blog => {
        if (blog) {
          console.log("aquui",blog)
          this.blogToEdit$.next(blog[0]);
          this.formBlog.controls['id'].setValue(blog[0]['id']);
          this.formBlog.controls['variable'].setValue(blog[0]['variable']);
          this.formBlog.controls['signo'].setValue(blog[0]['signo']);
          this.formBlog.controls['valor'].setValue(blog[0]['valor']);


        }
      });
  }
  add() {
    if (this.formBlog.valid) {
      let d = this.formBlog.value;
 
      this.FiltradoService.addCupones(this.formBlog.value).subscribe(response => {
        if (response) {
          
          this.toast.success(response['message']);
          this.router.navigate(['/admin/cupones']);
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
console.log('entro en el editar')
    // if (this.activatedRoute.snapshot.params) {
    //   this.formBlog.controls['id'].setValue(this.activatedRoute.snapshot.params.id);
    // }
    
    if (this.formBlog.valid) {
      let d = this.formBlog.value;
  
      this.FiltradoService.update(this.formBlog.value).subscribe(response => {
        if (response) {
          console.log('aqui esta la respuesta',response)
          this.toast.success(response['message']);
          this.router.navigate(['/admin/filtrando/list']);
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

}
