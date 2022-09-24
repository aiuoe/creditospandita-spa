import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RolesService } from 'app/shared/services/roles.service';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { AdicionalService } from 'app/shared/services/adicional.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Ng2ImgMaxService } from 'ng2-img-max';

import { environment } from "../../../environments/environment";

@Component({
  selector: 'app-adicional',
  templateUrl: './adicional.component.html',
  styleUrls: ['./adicional.component.scss']
})
export class AdicionalComponent implements OnInit {

  formBlog: FormGroup;
  page=1;
  per_page=30;
  blogToEdit$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  imagen
  nombreImagen
  urlImagen
  userLog
  nameImagen
  ruta = environment.webUrl
  isResize1 =false
  mostrarcheckanverso=0;
  doc
  tipo
  constructor(
    private fb: FormBuilder,
    private rolesService: RolesService,
    private AdicionalService: AdicionalService,
    private toast: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ng2ImgMax: Ng2ImgMaxService,
    private cd: ChangeDetectorRef,
  ) {
    this.formBlog = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      imagen: ['', Validators.required]

      
    });
   }

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        switchMap(params => {
          if (params['id']) {
            return this.AdicionalService.show(params['id']);
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
          this.formBlog.controls['nombre'].setValue(blog[0]['nombreDocumento']);
          this.urlImagen = blog[0]['imagen'];
        }
      });
  }

  add() {
    if (this.formBlog.valid) {
      let formData:FormData = new FormData();
      this.userLog = JSON.parse(localStorage.getItem('user')).id;
      this.formBlog.controls['id'].setValue(this.userLog);
      formData.append('id',this.userLog);
      formData.append('imagen', (this.imagen != null ? this.imagen : ''));
      formData.append('nombre_imagen', (this.nombreImagen != null ? this.nombreImagen : ''));
      formData.append('tipo',this.tipo);
      formData.append('nombreDocumento',this.formBlog.get('nombre').value);
      // let d = this.formTestimonial.value;
      //     if(this.imagen){
      //       var res = this.imagen.split(",");
      //       d['imagen'] = res[1];
      //       d['nombre_imagen'] = this.nombreImagen;
      //     }
      this.AdicionalService.add(formData).subscribe(response => {
        if (response) {
          
          this.toast.success("Datos guardados con exito!");
          this.router.navigate(['/admin-credit/adicional/list']);
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
    if (this.formBlog.valid) {
      let d = this.formBlog.value;
      if(this.imagen){
        var res = this.imagen.split(",");
        d['imagen'] = res[1];
        d['nombre_imagen'] = this.nombreImagen;
      }
      this.AdicionalService.update(this.formBlog.value).subscribe(response => {
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
  async onFileChange(event) {
    const reader = new FileReader();
    let fileList: FileList = event.target.files;
    let uploadedImage: Blob;
    if(event.target.files && event.target.files.length) {
      console.log("event",event.target.files)
      const [file2] = event.target.files;
      let file: File = fileList[0];
      console.log(file.type);
        if(file.type == 'image/jpeg' || file.type == 'image/png'){
          reader.readAsDataURL(file2);
          
            reader.onload = () => {
              this.urlImagen = reader.result;
            }
            this.isResize1 =true;        
          await this.ng2ImgMax.resizeImage(file, 600, 600).subscribe(
            result => {
              uploadedImage = result;
                this.imagen = uploadedImage;
                this.nombreImagen = file.name;
                this.tipo = 'imagen';

              this.isResize1=false
            },
            error => {
              this.isResize1=false
              console.log('Oh no!', error);
            }
          );

          // need to run CD since file load runs outside of zone
          this.cd.markForCheck();
        }else{
          reader.readAsDataURL(file2);
          // console.log(file);
            reader.onload = () => {
              this.urlImagen = '';
              this.doc = reader.result;
              var res = this.doc.split(",");
              this.imagen = res[1];
              this.nombreImagen = file.name;
              this.tipo = 'archivo';
            }
        }
        // };
        // console.log(this.registroForm.value);
    }
  }

}
