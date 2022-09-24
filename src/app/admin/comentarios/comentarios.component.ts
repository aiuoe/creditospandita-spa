import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RolesService } from 'app/shared/services/roles.service';
import { Observable, BehaviorSubject, of, from } from 'rxjs';
import { ComentariosService } from 'app/shared/services/comentarios.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Ng2ImgMaxService } from 'ng2-img-max';

import { environment } from "../../../environments/environment";
import swal from 'sweetalert2';



@Component({
  selector: 'app-comentarios',
  templateUrl: './comentarios.component.html',
  styleUrls: ['./comentarios.component.scss']
})
export class ComentariosComponent implements OnInit {

  formTestimonial: FormGroup;
  page=1;
  per_page=30;
  testimonialToEdit$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  imagen = null
  nombreImagen
  urlImagen
  ruta = environment.webUrl
  isResize =false
  usuarioComentario
  rutaImg = environment.apiBase+"/storage/app/public/"
  constructor(
    private fb: FormBuilder,
    private rolesService: RolesService,
    private ComentariosService: ComentariosService,
    private toast: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
    private ng2ImgMax: Ng2ImgMaxService
  ) { 
    this.formTestimonial = this.fb.group({
      id: [''],
      comentario: [''],
      evaluacionFk: [''],
      tab: [''],
      usuario: [''],
      imagen: [''],
      idSolicitudFk: [''],
    });
  }

  ngOnInit() {
    console.log('id de evaluacion',this.activatedRoute.snapshot.params.id)
    this.activatedRoute.params
      .pipe(
        switchMap(params => {
          console.log("PPP",params)
          if (params['id']) {
            // console.log('cul entro aqui')
            return this.ComentariosService.show(params['id']);
          } else if(params['idSolicitud']) {
            console.log("sollll");
            this.formTestimonial.controls['idSolicitudFk'].setValue(params['idSolicitud']);
            return of(null);
          }else{
            return of(null);
          }
        })
      )
      .subscribe(testimonial => {
        if (testimonial) {
          this.testimonialToEdit$.next(testimonial[0]);
          this.formTestimonial.controls['id'].setValue(testimonial[0]['id']);
          this.formTestimonial.controls['comentario'].setValue(testimonial[0]['comentario']);
          this.formTestimonial.controls['evaluacionFk'].setValue(testimonial[0]['evaluacionFk']);
          this.formTestimonial.controls['idSolicitudFk'].setValue(testimonial[0]['idSolicitudFk']);
          this.formTestimonial.controls['tab'].setValue(testimonial[0]['tab']);
          this.urlImagen = this.rutaImg+testimonial[0]['archivo'];
          console.log("aquui",this.formTestimonial.value)
        }
      });
  }

  add() {
      this.usuarioComentario=JSON.parse(localStorage.getItem('user')).first_name+' '+JSON.parse(localStorage.getItem('user')).last_name
      this.formTestimonial.controls['tab'].setValue(this.activatedRoute.snapshot.params.tab);
      this.formTestimonial.controls['usuario'].setValue(this.usuarioComentario);
    
    if(this.activatedRoute.snapshot.params.idSolicitud){
      if (this.formTestimonial.valid) {
        let formData:FormData = new FormData();
        formData.append('usuario',this.formTestimonial.get('usuario').value);
        formData.append('comentario',this.formTestimonial.get('comentario').value);
        formData.append('idSolicitudFk',this.formTestimonial.get('idSolicitudFk').value);
        formData.append('imagen', (this.imagen != null ? this.imagen : ''));
        formData.append('nombre_imagen', (this.nombreImagen != null ? this.nombreImagen : ''));
        // let d = this.formTestimonial.value;
        //     if(this.imagen){
        //       var res = this.imagen.split(",");
        //       d['imagen'] = res[1];
        //       d['nombre_imagen'] = this.nombreImagen;
        //     }
        this.ComentariosService.addSolicitud(formData).subscribe(response => {
          if (response) {
            
            this.toast.success("Datos guardados con exito!");
            this.router.navigate(['/admin/detalle-abiertos/',this.activatedRoute.snapshot.params.idSolicitud]);
          } else {
            this.toast.error(JSON.stringify(response));
          }
        },(error)=>
        {
          this.toast.error("Error inesperado!");
        });
      }
    }else{
      this.formTestimonial.controls['evaluacionFk'].setValue(this.activatedRoute.snapshot.params.evaluacion);
      if (this.formTestimonial.valid) {
        let formData:FormData = new FormData();
        formData.append('usuario',this.formTestimonial.get('usuario').value);
        formData.append('comentario',this.formTestimonial.get('comentario').value);
        formData.append('evaluacionFk',this.formTestimonial.get('evaluacionFk').value);
        formData.append('tab',this.formTestimonial.get('tab').value);
        formData.append('imagen', (this.imagen != null ? this.imagen : ''));
        formData.append('nombre_imagen', (this.nombreImagen != null ? this.nombreImagen : ''));
        // let d = this.formTestimonial.value;
        //     if(this.imagen){
        //       var res = this.imagen.split(",");
        //       d['imagen'] = res[1];
        //       d['nombre_imagen'] = this.nombreImagen;
        //     }
        this.ComentariosService.add(formData).subscribe(response => {
          if (response) {
            
            this.toast.success("Datos guardados con exito!");
            this.router.navigate(['/admin/evaluacion/',this.activatedRoute.snapshot.params.evaluacion]);
          } else {
            this.toast.error(JSON.stringify(response));
          }
        },(error)=>
        {
          this.toast.error("Error inesperado!");
        });
      }
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
      formData.append('usuario',this.formTestimonial.get('usuario').value);
      formData.append('id',this.activatedRoute.snapshot.params.id);
      formData.append('comentario',this.formTestimonial.get('comentario').value);
      formData.append('evaluacionFk',this.formTestimonial.get('evaluacionFk').value);
      formData.append('idSolicitudFk',this.formTestimonial.get('idSolicitudFk').value);
      formData.append('tab',this.formTestimonial.get('tab').value);
      formData.append('imagen', (this.imagen != null ? this.imagen : ''));
      formData.append('nombre_imagen', (this.nombreImagen != null ? this.nombreImagen : ''));
      this.ComentariosService.update(formData).subscribe(response => {
        if (response) {
          this.toast.success("Datos actualizados con exito!");
          if(this.formTestimonial.get('idSolicitudFk').value){
            this.router.navigate(['/admin/detalle-abiertos/',this.formTestimonial.get('idSolicitudFk').value]);
          }else{
            this.router.navigate(['/admin/evaluacion/',this.formTestimonial.get('evaluacionFk').value]);
          }
          
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
