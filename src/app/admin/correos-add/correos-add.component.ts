import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { RolesService } from 'app/shared/services/roles.service';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { CorreosService } from 'app/shared/services/correos.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { VariablesService } from 'app/shared/services/variables.service';
import { switchMap } from 'rxjs/operators';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { environment } from "../../../environments/environment";
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import 'froala-editor/js/plugins/font_size.min.js';
import 'froala-editor/js/plugins/font_family.min.js';
import 'froala-editor/js/plugins/emoticons.min.js';
import 'froala-editor/js/plugins/colors.min.js';
import 'froala-editor/js/plugins/image.min.js';
import 'froala-editor/js/plugins/lists.min.js';
import 'froala-editor/js/plugins/url.min.js';
import 'froala-editor/js/plugins/link.min.js';





@Component({
  selector: 'app-correos-add',
  templateUrl: './correos-add.component.html',
  styleUrls: ['./correos-add.component.scss']
})
export class CorreosAddComponent implements OnInit {
  public Editor = ClassicEditor;
  formBlog: FormGroup;
  carga;
  page=1;
  variables;
  mostrarPara=0;
  Nombre="<strong>{{Nombre}}</strong><br><small>(Nombre del cliente)</small>"
  Apellido="<strong>{{Apellido}}</strong><br><small>(Apellido del cliente)</small>"
  Cedula="<strong>{{Cedula}}</strong><br><small>(Cedula del cliente)</small>"
  Email="<strong>{{Email}}</strong><br><small>(Email del cliente)</small>"

  Ncredito="<strong>{{Ncredito}}</strong><br><small>(Número de credito)</small>"
  MontoTotal="<strong>{{Monto}}</strong><br><small>(Monto total del credito)</small>"
  Expedicion="<strong>{{Expedicion}}</strong><br><small>(Fecha de expedicion del credito)</small>"
  TipoCredito="<strong>{{TipoCredito}}</strong><br><small>(Tipo de credito)</small>"
  per_page=30;
  blogToEdit$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  imagen
  nombreImagen
  urlImagen
  usuarioEnvia
  ruta = environment.webUrl
  // tinymce.init({
  //   selector: "textarea",
  //   menu: {
  //     format: { title: "Format", items: "forecolor backcolor" }
  //   },
  //   toolbar: "forecolor backcolor"
  // });
  public options: Object = {
    emoticonsUseImage: false
    
    // placeholderText: 'Edit Your Content Here!',
    // charCounterCount: false,
    // toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
    // toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
    // toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
    // toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat','alert'],
}
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
    private CorreosService: CorreosService,
    private VariablesService: VariablesService,
    private toast: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
  ) {
    
    this.formBlog = this.fb.group({
      id:[''],
      pertenece: [''],
      contenido: [''],
      destinatario:[false],
      para:['']


    });
   }

  ngOnInit() {
    this.usuarioEnvia=JSON.parse(localStorage.getItem('user')).first_name+' '+JSON.parse(localStorage.getItem('user')).last_name

    this.activatedRoute.params
    .pipe(
      switchMap(params => {
        if (params['id']) {
          return this.CorreosService.show(params['id']);
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
        this.formBlog.controls['pertenece'].setValue(blog[0]['pertenece']);
 this.carga=blog[0]['pertenece'];
        this.formBlog.controls['contenido'].setValue(blog[0]['contenido']);


      }
    });

    this.formBlog.controls['contenido'].setValue('<table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;"> <tr class="gmail-fix" height="0" style="border-collapse:collapse;"> <td style="padding:0;Margin:0;"> <table width="600" cellspacing="0" cellpadding="0" border="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td cellpadding="0" cellspacing="0" border="0" style="padding:0;Margin:0;line-height:1px;min-width:600px;" height="0"><img src="https://esputnik.com/repository/applications/images/blank.gif" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;max-height:0px;min-height:0px;min-width:600px;width:600px;" alt width="600" height="1"></td></tr></table></td></tr><tr style="border-collapse:collapse;"> <td valign="top" style="padding:0;Margin:0;"> <table class="es-header" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:#FFA73B;background-repeat:repeat;background-position:center top;"> <tr style="border-collapse:collapse;"> <td align="center" bgcolor="#f4f4f4" style="padding:0;Margin:0;background-color:#F4F4F4;"> <table class="es-header-body" width="600" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;"> <tr style="border-collapse:collapse;"> <td align="left" style="Margin:0;padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:20px;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td width="580" valign="top" align="center" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;display:none;"></td></tr></table></td></tr></table></td></tr></table></td></tr></table> <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> <tr style="border-collapse:collapse;"> <td style="padding:0;Margin:0;background-color:#F4F4F4;" bgcolor="#f4f4f4" align="center"> <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;" width="600" cellspacing="0" cellpadding="0" align="center"> <tr style="border-collapse:collapse;"> <td align="left" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td width="600" valign="top" align="center" style="padding:0;Margin:0;"> <table style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;background-color:#F2A600;border-radius:4px;" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f2a600"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;display:none;"></td></tr></table></td></tr></table></td></tr></table></td></tr></table> <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;color:#F4F4F4;"> <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;" width="600" cellspacing="0" cellpadding="0" align="center"> <tr style="border-collapse:collapse;"> <td align="left" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td width="600" valign="top" align="center" style="padding:0;Margin:0;"> <table style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;border-radius:4px;background-color:#FFFFFF;" width="100%" cellspacing="0" cellpadding="0" bgcolor="#ffffff" role="presentation"> <tr style="border-collapse:collapse;"> <td align="left" style="Margin:0;padding-right:10px;padding-top:25px;padding-bottom:25px;padding-left:30px;font-size:0px;"><img src="https://fgrerv.stripocdn.email/content/guids/CABINET_fa638de74e9fa692166507b56f8382ce/images/58681584906696602.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="200"></td></tr><tr style="border-collapse:collapse;"> <td align="left" style="Margin:0;padding-bottom:5px;padding-left:30px;padding-right:30px;padding-top:35px;"><strong><h1 style="Margin:0;line-height:25px;mso-line-height-rule:exactly;font-family:lato, helvetica neue, helvetica, arial, sans-serif;font-size:21px;font-style:normal;font-weight:700;color:#666666;">Hola,{{Nombre}}!</h1></strong></td></tr><tr style="border-collapse:collapse;"> <td bgcolor="#ffffff" align="center" style="Margin:0;padding-top:5px;padding-bottom:5px;padding-left:20px;padding-right:20px;font-size:0;"> <table width="100%" height="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td style="padding:0;Margin:0px;border-bottom:1px solid #FFFFFF;background:rgba(0, 0, 0, 0) none repeat scroll 0% 0%;height:1px;width:100%;margin:0px;"></td></tr></table></td></tr><tr style="border-collapse:collapse;"> <td class="es-m-txt-l" bgcolor="#ffffff" align="left" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:30px;padding-right:30px;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:18px;font-family:lato, helvetica neue, helvetica, arial, sans-serif;line-height:27px;color:#666666;">Escriba aqui su contenido ...</p></td></tr><tr style="border-collapse:collapse;"> <td class="es-m-txt-l" align="left" style="Margin:0;padding-top:20px;padding-left:30px;padding-right:30px;padding-bottom:40px;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:18px;font-family:lato, helvetica neue, helvetica, arial, sans-serif;line-height:27px;color:#666666;">Atentamente, <br>Equipo Créditos Panda </p></td></tr></table></td></tr></table></td></tr></table></td></tr></table> <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;"> <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;" width="600" cellspacing="0" cellpadding="0" align="center"> <tr style="border-collapse:collapse;"> <td align="left" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td width="600" valign="top" align="center" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td align="center" style="Margin:0;padding-top:10px;padding-bottom:20px;padding-left:20px;padding-right:20px;font-size:0;"> <table width="100%" height="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td style="padding:0;Margin:0px;border-bottom:1px solid #F4F4F4;background:rgba(0, 0, 0, 0) none repeat scroll 0% 0%;height:1px;width:100%;margin:0px;"></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table> <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;"> <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;" width="600" cellspacing="0" cellpadding="0" align="center"> <tr style="border-collapse:collapse;"> <td align="left" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td width="600" valign="top" align="center" style="padding:0;Margin:0;"> <table style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;background-color:#F2A600;border-radius:4px;" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f2a600" role="presentation"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;padding-top:30px;padding-left:30px;padding-right:30px;"><h3 style="Margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:lato, helvetica neue, helvetica, arial, sans-serif;font-size:20px;font-style:normal;font-weight:normal;color:#FFFFFF;">¿Dudas o preguntas?</h3></td></tr><tr style="border-collapse:collapse;"> <td esdev-links-color="#ffa73b" align="center" style="padding:0;Margin:0;padding-bottom:30px;padding-left:30px;padding-right:30px;"><a target="_blank" href="https://viewstripo.email/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:lato, helvetica neue, helvetica, arial, sans-serif;font-size:16px;text-decoration:none;color:#FFFFFF;">Si tienes alguna duda o pregunta no dudes en comunicarte al 571 xxxx o escribirnos al correo info@creditospanda.com </a></td></tr></table></td></tr></table></td></tr></table></td></tr></table> <table cellpadding="0" cellspacing="0" class="es-footer" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;"> <table class="es-footer-body" width="600" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;"> <tr style="border-collapse:collapse;"> <td align="left" style="Margin:0;padding-top:30px;padding-bottom:30px;padding-left:30px;padding-right:30px;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td width="540" valign="top" align="center" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td align="left" style="padding:0;Margin:0;padding-top:25px;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:lato, helvetica neue, helvetica, arial, sans-serif;line-height:21px;color:#666666;">Este es un mensaje automático por favor no responda. <br>Por favor, agregar a tu lista de contáctenos el correo de <strong>info@creditospanda.com</strong> para asegurarte de que la información no se vaya automáticamente al correo spam.</p></td></tr></table></td></tr></table></td></tr></table></td></tr></table> <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;"> <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;" width="600" cellspacing="0" cellpadding="0" align="center"> <tr style="border-collapse:collapse;"> <td align="left" style="Margin:0;padding-left:20px;padding-right:20px;padding-top:30px;padding-bottom:30px;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td width="560" valign="top" align="center" style="padding:0;Margin:0;"> <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> <tr style="border-collapse:collapse;"> <td align="center" style="padding:0;Margin:0;display:none;"></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table> ');

  }
  add() {
    // this.formBlog.controls['enviadoPor'].setValue(this.usuarioEnvia);
    // if (this.formBlog.valid) {
      let d = this.formBlog.value;
 
      this.CorreosService.add(this.formBlog.value).subscribe(response => {
        if (response) {
          
          this.toast.success(response['message']);
          this.router.navigate(['/admin/correos/list']);
        } else {
          this.toast.error('Email no existe');
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
    // }
  }

  edit() {
    if (this.formBlog.valid) {
      let d = this.formBlog.value;
  
      this.CorreosService.update(this.formBlog.value).subscribe(response => {
        if (response) {
          this.toast.success(response['message']);
          this.router.navigate(['/admin/correos/list']);
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

  destinatario(){
    if(this.formBlog.get('destinatario').value==true){
      this.mostrarPara=1;
    }else{
      this.mostrarPara=0;
    }
  }
  


}
