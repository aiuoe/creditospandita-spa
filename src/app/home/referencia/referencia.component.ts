import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule  } from '@angular/forms';
import { CountryService } from '../../shared/services/country.service';
import * as Moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../shared/auth/auth.service';
import swal from 'sweetalert2';
@Component({
  selector: 'app-referencia',
  templateUrl: './referencia.component.html',
  styleUrls: ['./referencia.component.scss']
})
export class ReferenciaComponent implements OnInit {
  registroForm: FormGroup;
  countries
  basica_id_edit
  submitted = false;
  isAdmin = false
  msjSubmit =false
  clientSelectConfig = {
    searchPlaceholder: 'Buscar',
    noResultsFound: 'Sin resultados',
    placeholder: ' ',
    displayKey: 'name',
    searchOnKey: 'name',
    search: true,
    moreText: 'más'
  };
  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toast: ToastrService,
    private cd: ChangeDetectorRef,
    private countriesService: CountryService,
    private auth : AuthService
  ) {
    this.registroForm = this.fb.group({
      ReferenciaPersonalNombres:['', [Validators.required,
        Validators.pattern('[a-zA-Z ]*')
      ]],
      ReferenciaPersonalApellidos:['', [Validators.required,
        Validators.pattern('[a-zA-Z ]*')
      ]],
      ReferenciaPersonalCiudadFk:['', Validators.required],
      ReferenciaPersonalTelefono:['', [Validators.required, Validators.maxLength(10),
        Validators.pattern(/^-?(3)(|[0-9]\d*)?$/)
      ]],
      ReferenciaFamiliarNombres:['', [Validators.required,
        Validators.pattern('[a-zA-Z ]*')
      ]],
      ReferenciaFamiliarApellidos:['', [Validators.required,
        Validators.pattern('[a-zA-Z ]*')
      ]],
      ReferenciaFamiliarCiudadFk:['', Validators.required],
      ReferenciaFamiliarTelefono:['', [Validators.required,
        Validators.pattern(/^-?(|[0-9]\d*)?$/)
      ]],
      id:[''],
      QuienRecomendo:[''],
      ReferenciaPersonalCiudad:[''],
      relacionp:['', Validators.required],
      emailp:[''],
      relacionf:['', Validators.required],
      emailf:[''],
      ReferenciaFamiliarCiudad:['']
    });
   }

  ngOnInit() {
    this.Countries();
    this.obtenerDato();
  }

  get f() { return this.registroForm.controls; }
  obtenerDato(){
    if(this.auth.isAdmin()){
      this.isAdmin = true;
    }
    let usuario= JSON.parse(localStorage.getItem('user'))
    this.activatedRoute.params.subscribe(params => {
      // params["id"] = modo_edición
      
     
      if (params['id']) {
        this.basica_id_edit = params['id'];
      }else{
        if(usuario.id){
          this.basica_id_edit = usuario.id;
        }
      }
      });
        this.countriesService.getReferencia({id:this.basica_id_edit}).subscribe(response => {
          console.log(response)
          if(!response['msj']){
          Object.keys(response[0]).forEach(key => {
    
            if (this.registroForm.controls[key]) {
              console.log(this.registroForm.controls[key])
              this.registroForm.controls[key].setValue(response[0][key]);
              // this.tasksForm.controls['expiration_date'].setValue(Moment(response['expiration_date']).format('YYYY-MM-DD'));
            }
          });
        

          this.registroForm.controls['ReferenciaPersonalCiudadFk'].setValue(response[0]['ReferenciaPersonalCiudadFk']);
          this.registroForm.controls['ReferenciaPersonalCiudad'].setValue(response[0]['ReferenciaPersonalCiudadFk']);
          this.registroForm.controls['ReferenciaFamiliarCiudadFk'].setValue(response[0]['ReferenciaFamiliarCiudadFk']);
          this.registroForm.controls['ReferenciaFamiliarCiudad'].setValue(response[0]['ReferenciaFamiliarCiudadFk']);

          this.registroForm.controls['relacionp'].setValue(response[0]['relacionp']);
          this.registroForm.controls['relacionf'].setValue(response[0]['relacionf']);
          this.registroForm.controls['emailp'].setValue(response[0]['emailp']);
          this.registroForm.controls['emailf'].setValue(response[0]['emailf']);
         }
        });
      // } 
    
  }
  Countries(){
    this.countriesService.GetCountries().subscribe((res)=>{
      console.log(res);
      this.countries = res;
    },(error)=>{
      console.log(error);
    })
  }

  edit(numero) {
    this.submitted = true;
    if (this.registroForm.valid) {
      this.msjSubmit = true;
      this.registroForm.controls["id"].setValue(this.basica_id_edit);
      const id = this.basica_id_edit;
      this.countriesService.updateReferencia(id, this.registroForm.value).subscribe(response => {
        this.submitted = false;
        this.msjSubmit = false;
        if (response) {
          console.log(response)
           this.toast.success('Actualizado Correctamente');
           this.obtenerDato();
           if(numero==1){
             if(this.isAdmin){
               console.log('admin');
              this.router.navigate(['/home/',this.basica_id_edit]);
             }else{
              this.router.navigate(['/home']);
             }
            
            }else if(numero==3){
              if(this.isAdmin){
                this.router.navigate(['/home/financiera/list/',this.basica_id_edit]);
              }else{
                this.router.navigate(['/home/financiera/list']);
              }
              
            }
        } else {
          this.toast.error(JSON.stringify(response));
        }
      });
    }else{
      this.modalSeguro2();
      return;
    }
    // console.log(this.formUser.value);
  }

  

  cambioNumber(numero){
    
    if(numero==1){
      // this.edit();
      
      if(this.registroForm.valid){
       
        this.router.navigate(['/home']);
      }

    }
    if(numero==2){
      // this.edit();
      if(this.registroForm.valid){
       
        this.router.navigate(['/home/referencia/list']);
      }

    }
    if(numero==3){
      // this.edit();
      console.log(numero);
      if(this.registroForm.valid){
       
        this.router.navigate(['/home/financiera/list']);
      }

      
    }
  }

  clientSelected(country) {
    if (country) {
 
      this.registroForm.controls['ReferenciaPersonalCiudadFk'].setValue(country['name']);
      console.log(this.registroForm.value)
    }
  }

  
  clientSelected2(country) {
    if (country) {
 
      this.registroForm.controls['ReferenciaFamiliarCiudadFk'].setValue(country['name']);
      console.log(this.registroForm.value)
    }
  }
  modalSeguro2(){

    const confirm = swal.fire({
      title: "<strong>Faltan rellenar algunos campos requeridos</strong>",
      html: "",
      type: 'warning',
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: 'Aceptar',
      // confirmButtonText: 'Aceptar',
      focusCancel: true,
      width: "80%",
      customClass: {
        icon: 'icon-class-yellow',
        confirmButton: 'confirm-button-class',
        cancelButton: 'cancel-button-class'
      }
    });
  
    return confirm;
  }
}
