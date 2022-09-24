import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule  } from '@angular/forms';
import { CountryService } from '../../shared/services/country.service';
import * as Moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { environment } from "../../../environments/environment";
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { AdicionalService } from 'app/shared/services/adicional.service';

@Component({
  selector: 'app-ficha-referido',
  templateUrl: './ficha-referido.component.html',
  styleUrls: ['./ficha-referido.component.scss']
})
export class FichaReferidoComponent implements OnInit {

  ruta = environment.apiBase+"/storage/app/public/"
  currentJustify = 'fill';
  registroForm: FormGroup;
  formBlog: FormGroup;
  countries
  basica_id_edit
  submitted = false;
  estadoEstudioRo = false;
  maxBirthdate
  minFe
  disableFe = true;
  clientSelectConfig = {
    searchPlaceholder: 'Buscar',
    noResultsFound: 'Sin resultados',
    placeholder: ' ',
    displayKey: 'name',
    searchOnKey: 'name',
    search: true,
    moreText: 'más'
  };
  anverso = null
  reverso = null
  selfie = null
  basicas;
  user;
  referencias;
  financieras;
  mostrarcheckanverso=0;
  mostrarcheckreverso=0;
  mostrarcheckselfi=0;
  nameAnverso
  nameReverso
  nameSelfie
  adicionales;
  solicitudes;
  rutaGral;
  imgSelfie = null
  imgAnverso = null
  imgReverso = null
  isResize1 =false
  isResize2 =false
  isResize3 =false

  imagen
  nombreImagen
  urlImagen
  userLog
  nameImagen
  doc
  tipo
  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toast: ToastrService,
    private cd: ChangeDetectorRef,
    private AdicionalService:AdicionalService,
    private countriesService: CountryService,
    private ng2ImgMax: Ng2ImgMaxService
  ) {
    this.formBlog = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      imagen: ['', Validators.required]

      
    });
   }
  ngOnInit() {
    registerLocaleData(localeEs, 'es');
    this.activatedRoute.params
    .pipe(
      switchMap(params => {
        if (params['id']) {
          return this.countriesService.getBasica({id:params['id']});
        } else {
          return of(null);
        }
      })
    )
    .subscribe(blog => {
      if (blog) {
        this.basicas=blog.basica;
        this.user=blog.usuario;
        this.referencias=blog.referencia;
        this.financieras=blog.financiera;
        this.adicionales=blog.adicional;
        this.adicionales=blog.adicional;
        this.solicitudes=blog.solicitud;
        if(this.basicas){
          this.imgAnverso = this.ruta+this.basicas.anversoCedula;
          this.imgReverso=this.ruta+this.basicas.reversoCedula;
          this.imgSelfie=this.ruta+this.basicas.selfi;
        }
        
         console.log("aquui",blog)
         console.log(this.user)

      }
    });
    // console.log(this.basica_id_edit) 
  }


  obtenerDato(){
    // params["id"] = modo_edición
    let usuario= JSON.parse(localStorage.getItem('user'));
    
    if (usuario) {
      console.log("aqui",usuario)
        // this.basica_id_edit = usuario.id;
      
      this.countriesService.getBasica({id:this.basica_id_edit}).subscribe(response => {
        console.log("B",response)
        
        if(response['msj']){

        }else{
        Object.keys(response["basica"]).forEach(key => {
  
          if (this.registroForm.controls[key]) {
            // console.log(this.registroForm.controls[key])
            this.registroForm.controls[key].setValue(response["basica"][key]);
            // this.tasksForm.controls['expiration_date'].setValue(Moment(response['expiration_date']).format('YYYY-MM-DD'));
          }
        });
        Object.keys(response["usuario"]).forEach(key => {
  
          if (this.registroForm.controls[key]) {
            // console.log(this.registroForm.controls[key])
            this.registroForm.controls[key].setValue(response["usuario"][key]);
            // this.tasksForm.controls['expiration_date'].setValue(Moment(response['expiration_date']).format('YYYY-MM-DD'));
          }
        });
        if(response["basica"]["anversoCedula"]){
          this.imgAnverso = this.ruta+response["basica"]["anversoCedula"];
        }
        if(response["basica"]["reversoCedula"]){
          this.imgReverso = this.ruta+response["basica"]["reversoCedula"];
        }
        if(response["basica"]["selfi"]){
          this.imgSelfie = this.ruta+response["basica"]["selfi"];
        }
        
        this.registroForm.controls['ciudad'].setValue(response["basica"]['ciudad']);
        this.registroForm.controls['ciudads'].setValue(response["basica"]['ciudad']);
        }
        // console.log('ciudad',response[0]['ciudad'])
        


      });
    } 
}

async onFileChange(event) {
  const reader = new FileReader();
  let fileList: FileList = event.target.files;
  let uploadedImage: Blob;
  if(event.target.files && event.target.files.length) {
    console.log("event",event.target.files)
    const [file2] = event.target.files;
    let file: File = fileList[0];
      if(event.target.files.type == 'image/jpeg' || event.target.files.type == 'image/png'){
        reader.readAsDataURL(file2);
        // console.log(file);
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

add() {
  if (this.formBlog.valid) {
    let formData:FormData = new FormData();
    this.userLog = JSON.parse(localStorage.getItem('user')).id;
    this.formBlog.controls['id'].setValue(this.user.id);
    formData.append('id',this.user.id);
    formData.append('imagen', (this.imagen != null ? this.imagen : ''));
    formData.append('nombre_imagen', (this.nombreImagen != null ? this.nombreImagen : ''));
    formData.append('tipo',this.tipo);
    // let d = this.formTestimonial.value;
    //     if(this.imagen){
    //       var res = this.imagen.split(",");
    //       d['imagen'] = res[1];
    //       d['nombre_imagen'] = this.nombreImagen;
    //     }
    this.AdicionalService.add(formData).subscribe(response => {
      if (response) {
        
        this.toast.success("Datos guardados con exito!");
        // this.router.navigate(['/admin-credit/adicional/list']);
        this.ngOnInit();
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
