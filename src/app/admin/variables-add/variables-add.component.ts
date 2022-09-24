import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RolesService } from 'app/shared/services/roles.service';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { VariablesService } from 'app/shared/services/variables.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { environment } from "../../../environments/environment";

@Component({
  selector: 'app-variables-add',
  templateUrl: './variables-add.component.html',
  styleUrls: ['./variables-add.component.scss']
})
export class VariablesAddComponent implements OnInit {

  formBlog: FormGroup;
  page=1;
  per_page=30;
  blogToEdit$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  imagen
  nombreImagen
  urlImagen
  ruta = environment.webUrl

  constructor(
    private fb: FormBuilder,
    private rolesService: RolesService,
    private VariablesService: VariablesService,
    private toast: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
  ) {
    this.formBlog = this.fb.group({
      id: [''],
      variable: ['', Validators.required],
      ponderacion: ['', Validators.required],
      puntosTotales: ['', Validators.required],
      cantidadCategorias: ['', Validators.required],

    });
   }

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        switchMap(params => {
          if (params['id']) {
            return this.VariablesService.show(params['id']);
          } else {
            return of(null);
          }
        })
      )
      .subscribe(blog => {
        if (blog) {

          this.blogToEdit$.next(blog[0]);
          this.formBlog.controls['id'].setValue(blog[0]['id']);
          this.formBlog.controls['variable'].setValue(blog[0]['variable']);
          this.formBlog.controls['ponderacion'].setValue(blog[0]['ponderacion']);
          this.formBlog.controls['puntosTotales'].setValue(blog[0]['puntosTotales']);
          this.formBlog.controls['cantidadCategorias'].setValue(blog[0]['cantidadCategorias']);

        }
      });
  }
  add() {
    if (this.formBlog.valid) {
      let d = this.formBlog.value;
 
      this.VariablesService.add(this.formBlog.value).subscribe(response => {
        if (response) {
          
          this.toast.success(response['message']);
          this.router.navigate(['/admin/variables/list']);
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
  
      this.VariablesService.update(this.formBlog.value).subscribe(response => {
        if (response) {
          this.toast.success(response['message']);
          this.router.navigate(['/admin/variables/list']);
        } else {
          this.toast.error(JSON.stringify(response));
        }
      });
    }
    // console.log(this.formBlog.value);
  }



}
