import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RolesService } from 'app/shared/services/roles.service';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { BlogsService } from 'app/shared/services/blogs.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { environment } from "../../../environments/environment";


@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
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
    private blogService: BlogsService,
    private toast: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
  ) {
    this.formBlog = this.fb.group({
      id: [''],
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      descripcion_larga: ['', Validators.required],
      imagen: [''],
    });
   }

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        switchMap(params => {
          if (params['id']) {
            return this.blogService.show(params['id']);
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
          this.formBlog.controls['descripcion_larga'].setValue(blog[0]['descripcion_larga']);
          this.urlImagen = blog[0]['imagen'];
        }
      });
  }
  add() {
    if (this.formBlog.valid) {
      let d = this.formBlog.value;
          if(this.imagen){
            var res = this.imagen.split(",");
            d['imagen'] = res[1];
            d['nombre_imagen'] = this.nombreImagen;
          }
      this.blogService.add(this.formBlog.value).subscribe(response => {
        if (response) {
          
          this.toast.success(response['message']);
          this.router.navigate(['/admin/blog/list']);
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
      if(this.imagen){
        var res = this.imagen.split(",");
        d['imagen'] = res[1];
        d['nombre_imagen'] = this.nombreImagen;
      }
      this.blogService.update(this.formBlog.value).subscribe(response => {
        if (response) {
          this.toast.success(response['message']);
          this.router.navigate(['/admin/blog/list']);
        } else {
          this.toast.error(JSON.stringify(response));
        }
      });
    }
    // console.log(this.formBlog.value);
  }
  onFileChange(event) {
    const reader = new FileReader();
 
    if(event.target.files && event.target.files.length) {
      
      const [file] = event.target.files;
      
      reader.readAsDataURL(file);
      console.log(file);
        reader.onload = () => {
            
            this.imagen = reader.result;
            this.nombreImagen = file.name;
            console.log(this.nombreImagen)
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
        };
    }
  }
}
