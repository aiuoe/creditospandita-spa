import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RolesService } from 'app/shared/services/roles.service';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { AskService } from 'app/shared/services/ask.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { environment } from "../../../environments/environment";

@Component({
  selector: 'app-preguntas-add',
  templateUrl: './preguntas-add.component.html',
  styleUrls: ['./preguntas-add.component.scss']
})
export class PreguntasAddComponent implements OnInit {

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
    private askService: AskService,
    private toast: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
  ) {
    this.formBlog = this.fb.group({
      id: [''],
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],

    });
   }

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        switchMap(params => {
          if (params['id']) {
            return this.askService.show(params['id']);
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
          this.formBlog.controls['titulo'].setValue(blog[0]['titulo']);
          this.formBlog.controls['descripcion'].setValue(blog[0]['descripcion']);

        }
      });
  }
  add() {
    if (this.formBlog.valid) {
      let d = this.formBlog.value;
 
      this.askService.add(this.formBlog.value).subscribe(response => {
        if (response) {
          
          this.toast.success(response['message']);
          this.router.navigate(['/admin/preguntas/list']);
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
  
      this.askService.update(this.formBlog.value).subscribe(response => {
        if (response) {
          this.toast.success(response['message']);
          this.router.navigate(['/admin/preguntas/list']);
        } else {
          this.toast.error(JSON.stringify(response));
        }
      });
    }
    // console.log(this.formBlog.value);
  }


}
