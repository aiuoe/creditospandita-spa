import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RolesService } from 'app/shared/services/roles.service';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { TestimonialService } from 'app/shared/services/testimonial.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Ng2ImgMaxService } from 'ng2-img-max';

import { environment } from "../../../environments/environment";
@Component({
  selector: 'app-testimonial-add',
  templateUrl: './testimonial-add.component.html',
  styleUrls: ['./testimonial-add.component.scss']
})
export class TestimonialAddComponent implements OnInit {
  formTestimonial: FormGroup;
  page=1;
  per_page=30;
  testimonialToEdit$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  imagen = null
  nombreImagen
  urlImagen
  ruta = environment.webUrl
  isResize =false
  rutaImg = environment.apiBase+"/storage/app/public/"
  constructor(
    private fb: FormBuilder,
    private rolesService: RolesService,
    private testimonialService: TestimonialService,
    private toast: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
    private ng2ImgMax: Ng2ImgMaxService
  ) { 
    this.formTestimonial = this.fb.group({
      id: [''],
      nombres: ['', Validators.required],
      contenido: ['', Validators.required],
      descripcionCorta: ['', Validators.required],
      imagen: [''],
    });
  }

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        switchMap(params => {
          if (params['id']) {
            return this.testimonialService.show(params['id']);
          } else {
            return of(null);
          }
        })
      )
      .subscribe(testimonial => {
        if (testimonial) {
          this.testimonialToEdit$.next(testimonial[0]);
          this.formTestimonial.controls['id'].setValue(testimonial[0]['id']);
          this.formTestimonial.controls['nombres'].setValue(testimonial[0]['nombres']);
          this.formTestimonial.controls['contenido'].setValue(testimonial[0]['contenido']);
          this.formTestimonial.controls['descripcionCorta'].setValue(testimonial[0]['descripcionCorta']);
          this.urlImagen = this.rutaImg+testimonial[0]['imagen'];
          console.log("aquui",this.formTestimonial.value)
        }
      });
  }

  add() {
    if (this.formTestimonial.valid) {
      let formData:FormData = new FormData();
      formData.append('nombres',this.formTestimonial.get('nombres').value);
      formData.append('contenido',this.formTestimonial.get('contenido').value);
      formData.append('descripcionCorta',this.formTestimonial.get('descripcionCorta').value);
      formData.append('imagen', (this.imagen != null ? this.imagen : ''));
      formData.append('nombre_imagen', (this.nombreImagen != null ? this.nombreImagen : ''));
      // let d = this.formTestimonial.value;
      //     if(this.imagen){
      //       var res = this.imagen.split(",");
      //       d['imagen'] = res[1];
      //       d['nombre_imagen'] = this.nombreImagen;
      //     }
      this.testimonialService.add(formData).subscribe(response => {
        if (response) {
          
          this.toast.success("Datos guardados con exito!");
          this.router.navigate(['/admin/testimonial/list']);
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
    if (this.formTestimonial.valid) {
      // let d = this.formTestimonial.value;
      // if(this.imagen){
      //   var res = this.imagen.split(",");
      //   d['imagen'] = res[1];
      //   d['nombre_imagen'] = this.nombreImagen;
      // }
      let formData:FormData = new FormData();
      formData.append('id',this.formTestimonial.get('id').value);
      formData.append('nombres',this.formTestimonial.get('nombres').value);
      formData.append('contenido',this.formTestimonial.get('contenido').value);
      formData.append('descripcionCorta',this.formTestimonial.get('descripcionCorta').value);
      formData.append('imagen', (this.imagen != null ? this.imagen : ''));
      formData.append('nombre_imagen', (this.imagen != null ? this.imagen : ''));
      this.testimonialService.update(formData).subscribe(response => {
        if (response) {
          this.toast.success("Datos actualizados con exito!");
          this.router.navigate(['/admin/testimonial/list']);
        } else {
          this.toast.error("Error inesperado!");
        }
      });
    }
    // console.log(this.formTestimonial.value);
  }
  onFileChange2(event) {
    const reader = new FileReader();
    let fileList: FileList = event.target.files;
    let uploadedImage: Blob;
 
    if(event.target.files && event.target.files.length) {
      
      const [file2] = event.target.files;
      let file: File = fileList[0];
      
      reader.readAsDataURL(file2);
      // console.log(file2);
        reader.onload = () => {
            
            this.imagen = reader.result;
            this.nombreImagen = file.name;
            console.log(this.nombreImagen)
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
        };
    }
  }

  async onFileChange(event) {
    const reader = new FileReader();
    let fileList: FileList = event.target.files;
    let uploadedImage: Blob;
    if(event.target.files && event.target.files.length) {
      
      const [file2] = event.target.files;
      let file: File = fileList[0];
      reader.readAsDataURL(file2);
      // console.log(file);
            reader.onload = () => {
              this.urlImagen = reader.result;
            }
            this.isResize =true;        
          await this.ng2ImgMax.resizeImage(file, 600, 600).subscribe(
            result => {
              uploadedImage = result;
                this.imagen = uploadedImage;
                this.nombreImagen = file.name;
              this.isResize=false
            },
            error => {
              this.isResize=false
              console.log('Oh no!', error);
            }
          );

        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
        // };
        // console.log(this.registroForm.value);
    }
  }

}
