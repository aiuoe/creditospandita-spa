import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl,ReactiveFormsModule  } from '@angular/forms';
import { CountryService } from '../../shared/services/country.service';
import * as Moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import {formatCurrency, getCurrencySymbol, formatNumber} from '@angular/common';
import swal from 'sweetalert2';
import { Observable, from } from 'rxjs';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { RequestService } from '../../shared/services/request.service';
import { AuthService } from '../../shared/auth/auth.service';
import { element } from 'protractor';

@Component({
  selector: 'app-financiera',
  templateUrl: './financiera.component.html',
  styleUrls: ['./financiera.component.scss']
})
export class FinancieraComponent implements OnInit {
  registroForm: FormGroup;
  countries
  basica_id_edit
  activities = []
  submitted = false;
  msjSubmit = false
  mostrar=0;
  cantidad;
  cantidad2;
  pagandoActual2
  cantidad3
  camposLaborales=0
  txtCorrecto = '<h2>Tu crédito ha sido aprobado exitosamente</h2><h3>Te agradecemos haber escogido a Créditos Panda </h3><p>En unos instantes recibirás por SMS al celular registrado al igual que al correo electrónico un código único para firmar el contrato electrónicamente.</p><br>'
  txtPre = '<h2>Tu crédito ha sido aprobado exitosamente</h2><h3>Te agradecemos haber escogido a Créditos Panda</h3><br><p>En unos instantes recibirás por SMS al celular registrado al igual que al correo electrónico un código único para firmar el contrato electrónicamente.</p><br><h4 style="text-align: left;"><strong>Ten en cuenta la siguiente documentación que podrá ser requerida para la aprobación de tu crédito</strong></h4><br><ul class="fondito"><li class="chekin"><p>Si tus ingresos son menores a 1.5 salarios mínimos y puedes demostrar otras fuentes de ingreso entonces se re-evaluara tu solicitud. Enviar los extractos bancarios donde se evidencien estos ingresos al correo info@creditospanda.com.</p></li><li class="chekin"><p>Validar tu identidad es indispensable para nuestro análisis de crédito, verifica que las fotos de tu documento de identidad estén nítidas y claras. </p></li><li class="chekin"><p>Si no tienes vida crediticia te aconsejamos empezar ahora ya sea contratando un plan pospago para tu celular o sacando una tarjeta de crédito</p></li><li class="chekin"><p>Si alguna vez estuviste reportado y ya estas al día, entonces envíanos los soportes de paz y salvo al correo info@creditospanda.com</p></li><li class="chekin"><p>Si estás trabajando como independiente hace menos de 1 año, podemos re-considerar tu solicitud si tienes vehículo o moto a tu nombre. </p></li><li class="chekin"><p>Verifica que los datos de contacto de las referencias personales y comerciales estén al día para poder ser contactadas por nuestro equipo.</p></li></ul>'
  txtError = '<h3>En este momento debido a tu actual situación financiera no podemos aprobar el crédito, te aconsejamos ajustar tus finanzas y que vuelvas a intentarlo nuevamente.</h3>'
  contraOferta
  isAdmin=false
  clientSelectConfig = {
    searchPlaceholder: 'Buscar',
    noResultsFound: 'Sin resultados',
    placeholder: ' ',
    displayKey: 'name',
    searchOnKey: 'name',
    search: true,
    moreText: 'más'
  };
  diasSelectConfig = {
    searchPlaceholder: 'Buscar',
    noResultsFound: 'Sin resultados',
    placeholder: ' ',
    displayKey: 'name',
    searchOnKey: '',
    search: false,
    moreText: 'más'
  };
  dropdownSettings = {
    "singleSelection": false,
    "idField": "id",
    "textField": "name",
    "selectAllText": "Seleccionar todo",
    "unSelectAllText": "Deseleccionar todo",
    "itemsShowLimit": 3,
    "allowSearchFilter": true
  };
  isIndependiente = false
  isEmpleado = false
  isPensionado = false
  isEstudiante = false
  isOtros = false
  isNit =false
  isRut = false
  isDiario 
  isPagando
  isPeriodoSelect= false
  diasSelect =[]
  dias=[
    {id:1, name:'1'},{id:2, name:'2'},{id:3, name:'3'},{id:4, name:'4'},{id:5, name:'5'},
    {id:6, name:'6'},{id:7, name:'7'},{id:8, name:'8'},{id:9, name:'9'},{id:10, name:'10'},
    {id:11, name:'11'},{id:12, name:'12'},{id:13, name:'13'},{id:14, name:'14'},{id:15, name:'15'},
    {id:16, name:'16'},{id:17, name:'17'},{id:18, name:'18'},{id:19, name:'19'},{id:20, name:'20'},
    {id:21, name:'21'},{id:22, name:'22'},{id:23, name:'23'},{id:24, name:'24'},{id:25, name:'25'},
    {id:26, name:'26'},{id:27, name:'27'},{id:28, name:'28'},{id:29, name:'29'},{id:30, name:'30'},
    {id:31, name:'31'}
  ]
  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toast: ToastrService,
    private cd: ChangeDetectorRef,
    private countriesService: CountryService,
    private requestService: RequestService,
    private auth : AuthService
  ) {
    this.registroForm = this.fb.group({
      banco:['', Validators.required],
      tipoCuenta:['', Validators.required],
      nCuenta:['', [Validators.required,
        Validators.pattern(new RegExp(/^([0-9])*$/))
      ]],
      ingresoTotalMensual:['', [Validators.required,
        Validators.pattern(new RegExp(/^([0-9])*$/))
      ]],
      egresoTotalMensual:['', [Validators.required,
        Validators.pattern(new RegExp(/^([0-9])*$/))
      ]],
      otroIngreso:[''],
      proviene:[''],
      total_otro_ingr_mensual:[''],
      ingresoTotalMensualHogar:['',[
        Validators.pattern(new RegExp(/^([0-9])*$/))
      ]],
      egresoTotalMensualHogar:['',[
        Validators.pattern(new RegExp(/^([0-9])*$/))
      ]],
      comoTePagan:['', Validators.required],
      situacionLaboral:['', Validators.required],
      actividad:[''],
      antiguedadLaboral:['', Validators.required],
      nombreEmpresa:['', Validators.required],
      telefonoEmpresa:['', Validators.required],
      id:[''],
      usoCredito:['', Validators.required],
      periodoPagoNomina:['', Validators.required],
      diasPago:[''],
      diasP:[''],
      tarjetasCredito:['', Validators.required],
      creditosBanco:['', Validators.required],
      otrasCuentas:['', Validators.required],
      tipoEmpresa:[''],
      empresaConstituida:[''],
      nit:[''],
      rut:[''],
      nombreCargo:[''],
      ciudadTrabajas:[''],
      direccionEmpresa:[''],
      sectorEconomico:[''],
      tamanoEmpresa:[''],
      fondoPension:[''],
      bancoPension:[''],
      fuenteIngreso:[''],
      cual:[''],
      ciudads:[''],
      deudaActual:[''],
      pagandoActual:[''],
    });
   }

  ngOnInit() {
    registerLocaleData(localeEs, 'es');
    this.Countries();
    this.obtenerDato();
    this.pagandoActual('0')
    
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
        this.countriesService.getFinanciera({id:this.basica_id_edit}).subscribe(response => {
          console.log("ff",response)
          if(!response["msj"]){
          Object.keys(response[0]).forEach(key => {
    
            if (this.registroForm.controls[key]) {
              console.log(this.registroForm.controls[key])
              this.registroForm.controls[key].setValue(response[0][key]);
              
              // this.tasksForm.controls['expiration_date'].setValue(Moment(response['expiration_date']).format('YYYY-MM-DD'));
            }
          });
          this.otromensual();
          this.Activities();
          if(response[0]['periodoPagoNomina']){
            this.periodoPN(response[0]['periodoPagoNomina']);
          }
          if(response[0]['diasPago']){
            console.log(response[0]['diasPago'])
            let d = [{id:1, name:'1'},{id:2,name:'2'}]
            this.registroForm.controls['diasP'].setValue(JSON.parse(response[0]['diasPago']));
            this.registroForm.controls['diasPago'].setValue(JSON.parse(response[0]['diasPago']));
          }
          if(response[0]['tamanoEmpresa']){
            console.log('tamano empresa',response[0]['tamanoEmpresa'])
            this.registroForm.controls['tamanoEmpresa'].setValue(response[0]['tamanoEmpresa'])
          }
          this.registroForm.controls['ciudads'].setValue(response[0]['ciudadTrabajas']);
          if(response[0]['ingresoTotalMensual']){
            this.Ingresos_totales_mensuales(response[0]['ingresoTotalMensual'])
          }else{
            this.Ingresos_totales_mensuales('0')
          }
          if(response[0]['egresoTotalMensual']){
            this.Egresos_totales_mensuales(response[0]['egresoTotalMensual'])
          }else{
            this.Egresos_totales_mensuales('0')
          }
          if(response[0]['total_otro_ingr_mensual']){
            this.total_otro_ingr_mensual(response[0]['total_otro_ingr_mensual'])
          }else{
            this.total_otro_ingr_mensual('0')
          }
          if(response[0]['pagandoActual']){
            this.pagandoActual(response[0]['pagandoActual'])
          }else{
            this.pagandoActual('0')
          }
          if(response[0]['deudaActual']){
            this.deuda(response[0]['deudaActual'])
          }else{
            this.deuda('No')
          }
          
          }else{
            this.Ingresos_totales_mensuales('0')
            this.Egresos_totales_mensuales('0')
            this.total_otro_ingr_mensual('0')
           

          }
        });
      
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
    this.registroForm.controls['diasPago'].setValue(JSON.stringify(this.registroForm.controls['diasP'].value));
    if (this.registroForm.valid) {
      this.msjSubmit = true
      this.registroForm.controls["id"].setValue(this.basica_id_edit);
      const id = this.basica_id_edit;
      this.countriesService.updateFinanciera(id, this.registroForm.value).subscribe(response => {
        this.submitted = false;
        if (response) {
          console.log(response)
          
           this.toast.success('Actualizado Correctamente , Ahora puedes solicitar tu prestamo en la pestaña nueva solicitud');
           this.obtenerDato();
           this.msjSubmit = false
           let analisis = JSON.parse(JSON.stringify(response)).analisis
          this.contraOferta = JSON.parse(JSON.stringify(response)).analisis.contra_oferta
           if(analisis.estatus_solicitud !='' && analisis.estatus_solicitud !=null){
            if(analisis.estatus_solicitud == 'negado'){
              const confirm = this.modalError();
              from(confirm).subscribe(r => {
                
                  if(numero==1){
                    if(this.isAdmin){
                      this.router.navigate(['/home/', this.basica_id_edit]);
                    }else{
                    this.router.navigate(['/home']);
                    }
                    }else if(numero==2){
                      if(this.isAdmin){
                        this.router.navigate(['/home/referencia/list/', this.basica_id_edit]);
                      }else{
                        this.router.navigate(['/home/referencia/list']);
                      }
                    }
                
              })
            }else if(analisis.estatus_solicitud == 'preaprobado'){
              const confirm =this.modalPreaprobado();
              from(confirm).subscribe(r => {
                // this.modalContraOfertaPre(numero);
                if(numero==1){
                  if(this.isAdmin){
                    this.router.navigate(['/home/', this.basica_id_edit]);
                  }else{
                  this.router.navigate(['/home']);
                  }
                  }else if(numero==2){
                    if(this.isAdmin){
                      this.router.navigate(['/home/referencia/list/', this.basica_id_edit]);
                    }else{
                      this.router.navigate(['/home/referencia/list']);
                    }
                  }
              })
            }else if(analisis.estatus_solicitud == 'aprobado'){
              const confirm =this.modalCorrecto();
              from(confirm).subscribe(r => {
                //  this.modalContraOfertaCorrecto(numero);
                if(numero==1){
                  if(this.isAdmin){
                    this.router.navigate(['/home/', this.basica_id_edit]);
                  }else{
                  this.router.navigate(['/home']);
                  }
                  }else if(numero==2){
                    if(this.isAdmin){
                      this.router.navigate(['/home/referencia/list/', this.basica_id_edit]);
                    }else{
                      this.router.navigate(['/home/referencia/list']);
                    }
                  }
              })
            }
          }else{
            if(numero==1){
              if(this.isAdmin){
                this.router.navigate(['/home/', this.basica_id_edit]);
              }else{
              this.router.navigate(['/home']);
              }
              }else if(numero==2){
                if(this.isAdmin){
                  this.router.navigate(['/home/referencia/list/', this.basica_id_edit]);
                }else{
                  this.router.navigate(['/home/referencia/list']);
                }
              }
          }
        } else {
          this.msjSubmit = false
          this.toast.error(JSON.stringify(response));
        }
      });
    }else{
      this.modalSeguro2();
      return;
    }
    // console.log(this.formUser.value);
  }
  Activities(){
    let b = this.registroForm.get("situacionLaboral").value;
    let data
    if(b != "Independiente" && b != "Desempleado" && b != "Pensionado" && b != "Estudiante"){
      data = {
        "situacionLaboralFk" : "Empleado"
      }
    }else{
      data = {
        "situacionLaboralFk" : this.registroForm.get("situacionLaboral").value
      }
    }
    
    this.countriesService.GetActivities(data).subscribe((res)=>{
      console.log(res);
      if(res.msj){
        this.activities = [];
        this.registroForm.get("actividad").clearValidators();
        this.registroForm.get("actividad").updateValueAndValidity();
      }else{
        this.activities = res;
        this.registroForm.get("actividad").setValidators([Validators.required]);
        this.registroForm.get("actividad").updateValueAndValidity();
      }
      
    },(error)=>{
      this.activities = [];
      console.log(error);
    })

    if(this.registroForm.get("situacionLaboral").value=='Desempleado' || 
      this.registroForm.get("situacionLaboral").value=='Pensionado' || 
      this.registroForm.get("situacionLaboral").value=='Estudiante'){
      this.camposLaborales=0;
      if(this.registroForm.get("situacionLaboral").value=='Pensionado'){
        this.isIndependiente = false
        this.isEmpleado = false
        this.isPensionado = true
        this.isEstudiante = false
        this.registroForm.get("fondoPension").setValidators([Validators.required]);
        this.registroForm.get("fondoPension").updateValueAndValidity();
        this.registroForm.get("bancoPension").setValidators([Validators.required]);
        this.registroForm.get("bancoPension").updateValueAndValidity();
      }else if(this.registroForm.get("situacionLaboral").value=='Estudiante'){
        this.isIndependiente = false
        this.isEmpleado = false
        this.isPensionado = false
        this.isEstudiante = true
        this.registroForm.get("fuenteIngreso").setValidators([Validators.required]);
        this.registroForm.get("fuenteIngreso").updateValueAndValidity();
  
      }else{
        this.isIndependiente = false
        this.isEmpleado = false
        this.isPensionado = false
        this.isEstudiante = false
        this.registroForm.get("fuenteIngreso").clearValidators();
        this.registroForm.get("fuenteIngreso").updateValueAndValidity();
        this.registroForm.get("fondoPension").clearValidators();
        this.registroForm.get("fondoPension").updateValueAndValidity();
        this.registroForm.get("bancoPension").clearValidators();
        this.registroForm.get("bancoPension").updateValueAndValidity();
      }
      this.registroForm.get("antiguedadLaboral").clearValidators();
      this.registroForm.get("antiguedadLaboral").updateValueAndValidity();
      this.registroForm.get("nombreEmpresa").clearValidators();
      this.registroForm.get("nombreEmpresa").updateValueAndValidity();
      this.registroForm.get("telefonoEmpresa").clearValidators();
      this.registroForm.get("telefonoEmpresa").updateValueAndValidity();
      this.registroForm.get("tipoEmpresa").clearValidators();
      this.registroForm.get("tipoEmpresa").updateValueAndValidity();
      this.registroForm.get("tamanoEmpresa").clearValidators();
      this.registroForm.get("tamanoEmpresa").updateValueAndValidity();
      this.registroForm.get("empresaConstituida").clearValidators();
      this.registroForm.get("empresaConstituida").updateValueAndValidity();
      this.registroForm.get("nombreCargo").clearValidators();
      this.registroForm.get("nombreCargo").updateValueAndValidity();
      this.registroForm.get("ciudadTrabajas").clearValidators();
      this.registroForm.get("ciudadTrabajas").updateValueAndValidity();
      this.registroForm.get("direccionEmpresa").clearValidators();
      this.registroForm.get("direccionEmpresa").updateValueAndValidity();
      this.registroForm.get("sectorEconomico").clearValidators();
      this.registroForm.get("sectorEconomico").updateValueAndValidity();
    }else{
      this.camposLaborales=1;
      if(this.registroForm.get("situacionLaboral").value=='Independiente'){
        this.isIndependiente = true
        this.isEmpleado = false
        this.isPensionado = false
        this.isEstudiante = false
        this.registroForm.get("empresaConstituida").setValidators([Validators.required]);
        this.registroForm.get("empresaConstituida").updateValueAndValidity();


        this.registroForm.get("tipoEmpresa").clearValidators();
        this.registroForm.get("tipoEmpresa").updateValueAndValidity();
        this.registroForm.get("tamanoEmpresa").clearValidators();
        this.registroForm.get("tamanoEmpresa").updateValueAndValidity();
        this.registroForm.get("fuenteIngreso").clearValidators();
        this.registroForm.get("fuenteIngreso").updateValueAndValidity();
      }else{
        this.isIndependiente = false
        this.isEmpleado = true
        this.isPensionado = false
        this.isEstudiante = false
        this.registroForm.get("empresaConstituida").clearValidators();
        this.registroForm.get("empresaConstituida").updateValueAndValidity();

        this.registroForm.get("fuenteIngreso").clearValidators();
        this.registroForm.get("fuenteIngreso").updateValueAndValidity();

        this.registroForm.get("tipoEmpresa").setValidators([Validators.required]);
        this.registroForm.get("tipoEmpresa").updateValueAndValidity();
        this.registroForm.get("tamanoEmpresa").setValidators([Validators.required]);
        this.registroForm.get("tamanoEmpresa").updateValueAndValidity();
      }

      this.registroForm.get("antiguedadLaboral").setValidators([Validators.required]);
      this.registroForm.get("antiguedadLaboral").updateValueAndValidity();
      this.registroForm.get("nombreEmpresa").setValidators([Validators.required]);
      this.registroForm.get("nombreEmpresa").updateValueAndValidity();
      this.registroForm.get("telefonoEmpresa").setValidators([Validators.required,
        Validators.pattern(/^-?(|[0-9]\d*)?$/)
      ]);
      this.registroForm.get("telefonoEmpresa").updateValueAndValidity();

      this.registroForm.get("nombreCargo").setValidators([Validators.required]);
      this.registroForm.get("nombreCargo").updateValueAndValidity();
      this.registroForm.get("ciudadTrabajas").setValidators([Validators.required]);
      this.registroForm.get("ciudadTrabajas").updateValueAndValidity();
      this.registroForm.get("direccionEmpresa").setValidators([Validators.required]);
      this.registroForm.get("direccionEmpresa").updateValueAndValidity();
      this.registroForm.get("sectorEconomico").setValidators([Validators.required]);
      this.registroForm.get("sectorEconomico").updateValueAndValidity();

      this.registroForm.get("fondoPension").clearValidators();
      this.registroForm.get("fondoPension").updateValueAndValidity();
      this.registroForm.get("bancoPension").clearValidators();
      this.registroForm.get("bancoPension").updateValueAndValidity();
      this.registroForm.get("fuenteIngreso").clearValidators();
      this.registroForm.get("fuenteIngreso").updateValueAndValidity();
    
    }
  }

  ciudadTrabajasSelected(country) {
    if (country) {
      this.registroForm.controls['ciudadTrabajas'].setValue(country['name']);
    }
  }
  usarCredito(value){
    if(value == 'Otros'){
      this.isOtros = true
      this.registroForm.get("cual").setValidators([Validators.required]);
      this.registroForm.get("cual").updateValueAndValidity();
    }else{
      this.isOtros = false
      this.registroForm.get("cual").clearValidators();
      this.registroForm.get("cual").updateValueAndValidity();
    }
  }
  deuda(value){
    this.isPeriodoSelect = true;
    if(value == "No"){
      this.isPagando = false;
      this.registroForm.get("pagandoActual").clearValidators();
      this.registroForm.get("pagandoActual").updateValueAndValidity();
    }else{
      this.isPagando= true;
      this.registroForm.get("pagandoActual").setValidators([Validators.required]);
      this.registroForm.get("pagandoActual").updateValueAndValidity();
      
    }
  }
  cambioNumber(numero){
    console.log(numero);
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
      if(this.registroForm.valid){
       
        this.router.navigate(['/home/financiera/list']);
      }

      
    }
  }
  otromensual(){
    let v = this.registroForm.get("otroIngreso").value;
    if(v == "Si"){
      this.mostrar=1;
      this.registroForm.get("proviene").setValidators([Validators.required]);
      this.registroForm.get("proviene").updateValueAndValidity();
      this.registroForm.get("total_otro_ingr_mensual").setValidators([Validators.required,Validators.pattern(new RegExp(/^([0-9])*$/))]);
      this.registroForm.get("total_otro_ingr_mensual").updateValueAndValidity();
    }else{
      this.mostrar=0;
     this.registroForm.get("proviene").clearValidators();
     this.registroForm.get("proviene").updateValueAndValidity();
     this.registroForm.get("total_otro_ingr_mensual").clearValidators();
     this.registroForm.get("total_otro_ingr_mensual").updateValueAndValidity();
    }
   }
   limpiar(){
 
    if(this.cantidad !='$0'){
     
    }else{
     this.cantidad='';
    }
     if(this.cantidad2 !='$0'){
       
     }else{
     this.cantidad2='';
     }
     if(this.cantidad3 !='$0'){
     
     }else{
      this.cantidad3='';
     }
     if(this.pagandoActual2 !='$0'){
      
    }else{
     this.pagandoActual2='';
    }
    
  }
  Ingresos_totales_mensuales(value: string) {
    // ing_mensuales
    this.registroForm.controls["ingresoTotalMensual"].setValue(value);

    let val = parseInt(value, 10);
    if (Number.isNaN(val)) {
      
      val = 0;
    }

    
    this.cantidad = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'),'','1.0-0');
    console.log('primera funcion',this.cantidad)
}

Egresos_totales_mensuales(value: string) {
  // ing_mensuales
  this.registroForm.controls["egresoTotalMensual"].setValue(value);
console.log(value)
  let val = parseInt(value, 10);
  if (Number.isNaN(val)) {
    val = 0;
  }
  this.cantidad2 = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'),'','1.0-0');
}
total_otro_ingr_mensual(value: string) {
  // ing_mensuales
  this.registroForm.controls["total_otro_ingr_mensual"].setValue(value);
console.log(value)
  let val = parseInt(value, 10);
  if (Number.isNaN(val)) {
    val = 0;
  }
  this.cantidad3 = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'),'','1.0-0');
}
pagandoActual(value: string) {
  // ing_mensuales
  if(value == '0'){
    this.registroForm.controls["pagandoActual"].setValue(' ');
  }else{
    this.registroForm.controls["pagandoActual"].setValue(value);
  }
  
console.log(value)
  let val = parseInt(value, 10);
  if (Number.isNaN(val)) {
    val = 0;
  }
  this.pagandoActual2 = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'),'','1.0-0');
}
modalCorrecto(){
  const confirm = swal.fire({
    title: "<strong style='color:#0CC27E;'>¡Felicitaciones!</strong>",
    html: this.txtCorrecto,
    type: 'success',
    showConfirmButton: true,
    showCancelButton: false,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Siguiente',
    focusCancel: true,
    width: "80%",
    customClass: {
      icon: 'icon-class-success',
      confirmButton: 'confirm-button-class',
      cancelButton: 'cancel-button-class'
    }
  });

  return confirm;
}
modalError(){
  const confirm = swal.fire({
    title: "<strong style='color:red;'>¡Los sentimos!</strong>",
    html: this.txtError,
    type: 'error',
    showConfirmButton: true,
    showCancelButton: false,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Confirmar',
    focusCancel: true,
    width: "80%",
    customClass: {
      icon: 'icon-class-red',
      confirmButton: 'confirm-button-class',
      cancelButton: 'cancel-button-class'
    }
  });

  return confirm;
}
modalPreaprobado(){
  const confirm = swal.fire({
    title: "<strong style='color:#f36c21'>¡Credito Pre-aprobado!</strong>",
    html: this.txtPre,
    type: 'warning',
    showConfirmButton: true,
    showCancelButton: false,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Siguiente',
    focusCancel: true,
    width: "80%",
    customClass: {
      icon: 'icon-class',
      confirmButton: 'confirm-button-class',
      cancelButton: 'cancel-button-class'
    }
  });

  return confirm;
}
modalContraOfertaPre(numero){
  let montoSolicitado = formatNumber(this.contraOferta.montoSolicitado, 'es')
  let montoAprobado = formatNumber(this.contraOferta.montoAprobado, 'es')
  let tasaInteres = formatNumber(this.contraOferta.tasaInteres, 'es')
  let subtotal = formatNumber(this.contraOferta.subtotal, 'es')
  let plataforma = formatNumber(this.contraOferta.plataforma, 'es')
  let aprobacionRapida = formatNumber(this.contraOferta.aprobacionRapida, 'es')
  let iva = formatNumber(this.contraOferta.iva, 'es')
  let totalPagar = formatNumber(this.contraOferta.totalPagar, 'es')
  let text = '<h4>Recuerda que si pagas a tiempo tus créditos, tu cupo ira incrementando al igual que la flexibilidad en tus pagos.</h4><p>Una vez realices el pago exitosamente, te reportaremos POSITIVAMENTE en las centrales de riesgo.<br>¡Te ayudamos a crear o a mejorar tu historial crediticio!</p><div class="row"><div class="col-md-6 col-md-offset-3"><table class="table table-bordered"><tbody><tr><th>Monto Solicitado</th><td>$ '+montoSolicitado+'</td></tr><tr><th>Monto Aprobado</th><td>$ '+montoAprobado+'</td></tr><tr><th>Tasa de interes</th><td>$ '+tasaInteres+'</td></tr><tr><th>Subtotal</th><td>$ '+subtotal+'</td></tr><tr><th>Plataforma</th><td>$ '+plataforma+'</td></tr><tr><th>Aprobación rapida</th><td>$ '+aprobacionRapida+'</td></tr><tr><th>IVA</th><td>$ '+iva+'</td></tr><tr><th>Total a pagar</th><td>$ '+totalPagar+'</td></tr></tbody></table></div></div>'
  const confirm = swal.fire({
    title: "<strong style='color:#fdcb30'>¡Te estamos conociendo!</strong>",
    html: text,
    type: 'success',
    showConfirmButton: true,
    showCancelButton: true,
    cancelButtonText: 'Rechazar',
    confirmButtonText: 'Aceptar',
    focusCancel: false,
    width: "80%",
    customClass: {
      icon: 'icon-class-yellow',
      confirmButton: 'confirm-button-class',
      cancelButton: 'cancel-button-class'
    }
  });
  from (confirm).subscribe(rr=>{
    if(rr['value']){
      this.editCo(rr['value'], numero);
    }else{
      const ms = this.modalSeguro();
      from (ms).subscribe(r=>{
        if(r['value']){
          this.editCo(false, numero);
        }else{
          this.modalContraOfertaPre(numero);
        }
      })
    }
    
  })

  // return confirm;
}
modalContraOfertaCorrecto(numero){
  let montoSolicitado = formatNumber(this.contraOferta.montoSolicitado, 'es')
  let montoAprobado = formatNumber(this.contraOferta.montoAprobado, 'es')
  let tasaInteres = formatNumber(this.contraOferta.tasaInteres, 'es')
  let subtotal = formatNumber(this.contraOferta.subtotal, 'es')
  let plataforma = formatNumber(this.contraOferta.plataforma, 'es')
  let aprobacionRapida = formatNumber(this.contraOferta.aprobacionRapida, 'es')
  let iva = formatNumber(this.contraOferta.iva, 'es')
  let totalPagar = formatNumber(this.contraOferta.totalPagar, 'es')
  let text = '<h4>Recuerda que si pagas a tiempo tus créditos, tu cupo ira incrementando al igual que la flexibilidad en tus pagos.</h4><p>Una vez realices el pago exitosamente, te reportaremos POSITIVAMENTE en las centrales de riesgo.<br>¡Te ayudamos a crear o a mejorar tu historial crediticio!</p><div class="row"><div class="col-md-6 col-md-offset-3"><table class="table table-bordered"><tbody><tr><th>Monto Solicitado</th><td>$ '+montoSolicitado+'</td></tr><tr><th>Monto Aprobado</th><td>$ '+montoAprobado+'</td></tr><tr><th>Tasa de interes</th><td>$ '+tasaInteres+'</td></tr><tr><th>Subtotal</th><td>$ '+subtotal+'</td></tr><tr><th>Plataforma</th><td>$ '+plataforma+'</td></tr><tr><th>Aprobación rapida</th><td>$ '+aprobacionRapida+'</td></tr><tr><th>IVA</th><td>$ '+iva+'</td></tr><tr><th>Total a pagar</th><td>$ '+totalPagar+'</td></tr></tbody></table></div></div>'
  const confirm = swal.fire({
    title: "<strong style='color:#fdcb30;'>¡Te estamos conociendo!</strong>",
    html: text,
    type: 'success',
    showConfirmButton: true,
    showCancelButton: true,
    cancelButtonText: 'Rechazar',
    confirmButtonText: 'Aceptar',
    focusCancel: false,
    width: "80%",
    customClass: {
      icon: 'icon-class-yellow',
      confirmButton: 'confirm-button-class',
      cancelButton: 'cancel-button-class'
    }
  });
  from (confirm).subscribe(rr=>{
    if(rr['value']){
      this.editCo(rr['value'], numero);
    }else{
      const ms = this.modalSeguro();
      from (ms).subscribe(r=>{
        if(r['value']){
          this.editCo(false, numero);
        }else{
          this.modalContraOfertaCorrecto(numero);
        }
      })
    }
    
  })

  // return confirm;
}
editCo(estatus, numero){
  let est
  if(estatus){
    est = 'aceptado';
  }else{
    est = 'rechazado'
  }
  let data = {
    id: this.contraOferta.id,
    estatus: est
  }
  this.requestService.editarContraOferta(data).subscribe((res)=>{
    console.log(res)
    if(numero==1){
      if(this.isAdmin){
        this.router.navigate(['/home/', this.basica_id_edit]);
      }else{
      this.router.navigate(['/home']);
      }
      }else if(numero==2){
        if(this.isAdmin){
          this.router.navigate(['/home/referencia/list/', this.basica_id_edit]);
        }else{
          this.router.navigate(['/home/referencia/list']);
        }
      }
  },(error)=>{
    console.log(error)
    return false;
  })
}
modalSeguro(){

  const confirm = swal.fire({
    title: "<strong>¿Estas seguro?</strong>",
    html: "",
    type: 'warning',
    showConfirmButton: true,
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Aceptar',
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
isEmpresaConst(value){
  if(value =="Si"){
    this.isNit =true;
    this.isRut=false;
  }else{
    this.isNit =false;
    this.isRut=true;
  }
}
periodoPN(value){
  this.isPeriodoSelect = true;
  console.log('diario',value)
  if(value == "Diario"){
    this.isDiario = false;
    this.registroForm.get("diasPago").clearValidators();
    this.registroForm.get("diasPago").updateValueAndValidity();
  }else{
    this.isDiario = true;
    this.registroForm.get("diasPago").setValidators([Validators.required]);
    this.registroForm.get("diasPago").updateValueAndValidity();
    
  }
}
diasSelected(value){
  console.log("diasvvvv",value);
  console.log("dias",this.registroForm.controls['diasP'].value);
  // let d = ''
  // value.forEach(element => {
  //   d= d+element.name+',';
  // });
  // // console.log(d);
  // this.registroForm.controls['diasPago'].setValue(d);
  // this.registroForm.controls['diasPago'].setValue(JSON.stringify(value));
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
