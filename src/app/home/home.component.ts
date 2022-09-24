import { Component, OnInit, ChangeDetectorRef, Injectable, ViewChild ,ViewEncapsulation  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule  } from '@angular/forms';
import { CountryService } from '../shared/services/country.service';
import { RequestService } from '../shared/services/request.service';
import { AuthService } from '../shared/auth/auth.service';
import * as Moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { environment } from "../../environments/environment";
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {NgbDatepickerI18n, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { registerLocaleData, formatNumber, formatCurrency, getCurrencySymbol } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { DatePipe } from '@angular/common';
import swal from 'sweetalert2';
const I18N_VALUES = {
  'es': {
    weekdays: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'],
    months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  }
  // other languages you would support
};
@Injectable()
export class I18n {
  language = 'es';
}
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

  constructor(private _i18n: I18n) {
    super();
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return I18N_VALUES[this._i18n.language].months[month - 1];
  }
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }
}
const now = new Date();
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],

  providers: [I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n},DatePipe],
  // encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  ruta = environment.apiBase+"/storage/app/public/"
  registroForm: FormGroup;
  contraOfertaForm: FormGroup;
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
  mostrarcheckanverso=0;
  mostrarcheckreverso=0;
  mostrarcheckselfi=0;
  nameAnverso
  nameReverso
  nameSelfie
  imgSelfie = null
  imgAnverso = null
  imgReverso = null
  isResize1 =false
  isResize2 =false
  isResize3 =false
  isAdmin = false
  maxDate
  minDate
  ano
  mes;
  dia
  fechasesenta
  fechaN
  fechaEC
  closeResult: string;
  cargarte;
  tablaContraOferta
  temporalfechanac
  temporalfechaexp
  cantidad
  segSoc = false
  reporCred= false
  entidadOtros = false
  msjSubmit =false
  @ViewChild('content') content;
  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toast: ToastrService,
    private cd: ChangeDetectorRef,
    private countriesService: CountryService,
    private ng2ImgMax: Ng2ImgMaxService,
    private auth : AuthService,
    private modalService: NgbModal,
    private _modalService: NgbModal,
    private datePipe: DatePipe,
    private requestService:RequestService
  ) { 
    this.registroForm = this.fb.group({
      first_name:[''],
      second_name:[''],
      last_name:[''],
      second_last_name:[''],
      email:[''],
      phone_number:['',[Validators.required, Validators.maxLength(11),
        Validators.pattern(/^(3)([0-9])*$/)
      ]],
      ciudad:['', Validators.required],
      direccion:['', Validators.required],
      tipoVivienda:['', Validators.required],
      tienmpoVivienda:['', Validators.required],
      conquienVives:['', Validators.required],
      estrato:['', Validators.required],
      genero:[''],
      fechaNacimiento:[''],
      estadoCivil:['', Validators.required],
      personasaCargo:['', Validators.required],
      nCedula:[''],
      fechaExpedicionCedula:[''],
      nHijos:['', Validators.required],
      tipoPlanMovil:['', Validators.required],
      nivelEstudio:['', Validators.required],
      estadoEstudio:['', Validators.required],
      vehiculo:['', Validators.required],
      placa:[''],
      id:[''],
      ciudads:[''],
      centralRiesgo:['', Validators.required],
      nombre_anverso:[''],
      nombre_reverso:[''],
      nombre_selfie:[''],
      cc_anverso:[''],
      cc_reverso:[''],
      selfie:[''],
      fechaN:[''],
      fechaEC:[''],
      nroPersonasDependenEconomicamente :['', Validators.required],
      cotizasSeguridadSocial:['', Validators.required],
      tipoAfiliacion:[''],
      eps:[''],
      entidadReportado:[''],
      cualEntidadReportado:[''],
      valorMora:[''],
      tiempoReportado:[''],
      estadoReportado:[''],
      motivoReportado:[''],
      comoEnterasteNosotros:['', Validators.required],
    });
    this.contraOfertaForm = this.fb.group({
      id:[''],
      fechaAceptado:['', Validators.required],
      fechaN:['', Validators.required],
      estatus:['aceptado']

    });
  }

  ngOnInit() {
    registerLocaleData(localeEs, 'es');
    this.Countries();
    this.obtenerDato();
    this.MaxBirthdate();
    this.valor_mora('0');  
    // console.log("");
   
  }
  get f() { return this.registroForm.controls; }
  
  nivelEstudios(){
    let v = this.registroForm.get("nivelEstudio").value;
    if(v != "Ninguno"){
      this.registroForm.controls["estadoEstudio"].setValue("");
      this.estadoEstudioRo = false;
    }else{
      this.registroForm.controls["estadoEstudio"].setValue("Ninguno");
      this.estadoEstudioRo = true;
    }
   }
   vehiculoPropio(){
    let v = this.registroForm.get("vehiculo").value;
    if(v != "Ninguno"){
      this.registroForm.get("placa").setValidators([Validators.required]);
      this.registroForm.get("placa").updateValueAndValidity();
    }else{
     this.registroForm.get("placa").clearValidators();
     this.registroForm.get("placa").updateValueAndValidity();
    }
   }
  //  MaxBirthdate(){
  //   let dat = Moment().subtract(18,"year");
  //   this.maxBirthdate = Moment(dat).format("YYYY-MM-DD");
  //   console.log(Moment(dat).format("YYYY-MM-DD"));

  // }
  MaxBirthdate(){
    let dat = Moment().subtract(18,"year");
    this.maxBirthdate = Moment(dat).format("YYYY-MM-DD");
    console.log(Moment(dat).format("YYYY-MM-DD"));

    var splitted = this.maxBirthdate.split("-", 3); 
    this.ano=splitted[0]
    this.mes=splitted[1]
    this.dia=splitted[2]

    this.maxDate= {year: now.getFullYear() - 18, month: now.getMonth() + 1, day: now.getDate()}
    this.fechasesenta={year: now.getFullYear() - 60, month: 12, day: 31}
// console.log(now.getMonth())



  }
  minFE(event){
    let d = '';
    if(event.day < 10){
      d='0'+event.day;
    }else{
      d=event.day;
    }
    let m = '';
    if(event.month < 10){
      m='0'+event.month;
    }else{
      m=event.month;
    }
  var fecha = event.year+'-'+m+'-'+d;
    
    this.registroForm.controls['fechaNacimiento'].setValue(fecha);
    let dateBd = this.registroForm.get('fechaNacimiento').value;
    let minfe = Moment(dateBd).add(10, 'year');
    this.minFe = Moment(minfe).format("YYYY-MM-DD");
    this.disableFe = false;
    console.log("year",this.minFe);

    this.minDate = {year: parseInt(Moment(minfe).format("YYYY")), month: now.getMonth() + 1, day: now.getDate()};
    console.log(fecha);

  }
  setFechaEx(event){
    let d = '';
    if(event.day < 10){
      d='0'+event.day;
    }else{
      d=event.day;
    }
    let m = '';
    if(event.month < 10){
      m='0'+event.month;
    }else{
      m=event.month;
    }
  var fecha = event.year+'-'+m+'-'+d;
    this.registroForm.controls['fechaExpedicionCedula'].setValue(fecha);
    console.log(this.registroForm.value);
  }
  obtenerDato(){
      // params["id"] = modo_edición
      let usuario
      this.activatedRoute.params.subscribe( params =>{
          console.log(params)
          if(params['id']){
            usuario = {id: params['id']}
            if(this.auth.isAdmin()){
              this.isAdmin =true;
              if(params['creat']){
                this.registroForm.get("fechaNacimiento").setValidators([Validators.required]);
                this.registroForm.get("fechaNacimiento").updateValueAndValidity();
                this.registroForm.get("fechaExpedicionCedula").setValidators([Validators.required]);
                this.registroForm.get("fechaExpedicionCedula").updateValueAndValidity();
                this.registroForm.get("genero").setValidators([Validators.required]);
                this.registroForm.get("genero").updateValueAndValidity();
                this.registroForm.get("nCedula").setValidators([Validators.required]);
                this.registroForm.get("nCedula").updateValueAndValidity();
                this.registroForm.get("first_name").setValidators([Validators.required]);
                this.registroForm.get("first_name").updateValueAndValidity();
                this.registroForm.get("last_name").setValidators([Validators.required]);
                this.registroForm.get("last_name").updateValueAndValidity();
                this.registroForm.get("email").setValidators([Validators.required]);
                this.registroForm.get("email").updateValueAndValidity();
                this.registroForm.get("cc_anverso").setValidators([Validators.required]);
                this.registroForm.get("cc_anverso").updateValueAndValidity();
                this.registroForm.get("cc_reverso").setValidators([Validators.required]);
                this.registroForm.get("cc_reverso").updateValueAndValidity();
                this.registroForm.get("selfie").setValidators([Validators.required]);
                this.registroForm.get("selfie").updateValueAndValidity();
              }
            }
          }else  {
            usuario= JSON.parse(localStorage.getItem('user'));
          }
        });
      
      
      if (usuario) {
        console.log("aqui",usuario)
          this.basica_id_edit = usuario.id;
        
        this.countriesService.getBasica({id:this.basica_id_edit}).subscribe(response => {
          this.cargarte=response;
          
          if(response['msj']){

          }else{
            if(response["basica"]){
           
          Object.keys(response["basica"]).forEach(key => {
    
            if (this.registroForm.controls[key]) {
              // console.log(this.registroForm.controls[key])
              this.registroForm.controls[key].setValue(response["basica"][key]);
              // this.tasksForm.controls['expiration_date'].setValue(Moment(response['expiration_date']).format('YYYY-MM-DD'));
            }
          });
          if(response["basica"]["anversoCedula"]){
            this.imgAnverso = this.ruta+response["basica"]["anversoCedula"];
          }
          if(response["basica"]["cotizasSeguridadSocial"] == 'Si'){
            this.seguridadSocial('Si');
          }
          if(response["basica"]["centralRiesgo"] == 'Si'){
            this.reportadoCredito('Si');
          }
          if(response["basica"]["entidadReportado"] == 'Otros'){
            this.entidadRepor('Otros');
          }
          if(parseInt(response["basica"]["valorMora"]) > 0){
            this.valor_mora(response["basica"]["valorMora"]);
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
          if(response["usuario"]){
          Object.keys(response["usuario"]).forEach(key => {
    
            if (this.registroForm.controls[key]) {
              // console.log(this.registroForm.controls[key])
              this.registroForm.controls[key].setValue(response["usuario"][key]);
              // this.tasksForm.controls['expiration_date'].setValue(Moment(response['expiration_date']).format('YYYY-MM-DD'));
            }
          });
          this.registroForm.controls['nCedula'].setValue(response["usuario"]['n_document']);

          if(response["basica"]["fechaNacimiento"]){
            let fn = response["basica"]["fechaNacimiento"];
            this.temporalfechanac=response["basica"]["fechaNacimiento"]
            var splitted = fn.split("-", 3); 
            let ano=splitted[0]
            let mes=splitted[1]
            let dia=splitted[2]

            const dateIni = response["basica"]["fechaNacimiento"]
            const iniYear =  Number(this.datePipe.transform(dateIni, 'yyyy'));
            const iniMonth =  Number(this.datePipe.transform(dateIni, 'MM'));
            const iniDay =  Number(this.datePipe.transform(dateIni, 'dd'));
           
            console.log("fecha",iniYear+'/'+iniMonth+'/'+iniDay)
            this.fechaN ={year: parseInt(ano), month: parseInt(mes), day: parseInt(dia)}
             this.registroForm.controls['fechaN'].setValue({year: now.getFullYear() - 60, month: 12, day: 31});
            
         
          }

          if(response["basica"]["fechaExpedicionCedula"]){
            let fec = response["basica"]["fechaExpedicionCedula"];
            this.temporalfechaexp=response["basica"]["fechaExpedicionCedula"];
            var splitted = fec.split("-", 3); 
            let ano=splitted[0]
            let mes=splitted[1]
            let dia=splitted[2]
            this.fechaEC = {year: parseInt(ano), month: parseInt(mes), day: parseInt(dia)}
            this.registroForm.controls['fechaEC'].setValue({year: parseInt(ano), month: parseInt(mes), day: parseInt(dia)});
            // this.fechaEC = {year: parseInt(ano), month: parseInt(mes), day: parseInt(dia)};
          }
          console.log("fn", this.registroForm.value)

        }
        
          }
          // console.log('ciudad',response[0]['ciudad'])
          


        });
      } 
  }
  Countries(){
    this.countriesService.GetCountries().subscribe((res)=>{
      // console.log("countries",res);
      this.countries = res;
    },(error)=>{
      console.log(error);
    })
  }

  edit(numero) {
    this.submitted = true;
    let formData:FormData = new FormData();

    if (this.registroForm.valid) {
      this.msjSubmit = true;
      this.registroForm.controls["id"].setValue(this.basica_id_edit);
      formData.append('first_name',this.registroForm.get('first_name').value);
      formData.append('second_name',this.registroForm.get('second_name').value);
      formData.append('last_name',this.registroForm.get('last_name').value);
      formData.append('second_last_name',this.registroForm.get('second_last_name').value);
      formData.append('email',this.registroForm.get('email').value);
      formData.append('phone_number',this.registroForm.get('phone_number').value);
      formData.append('ciudad',this.registroForm.get('ciudad').value);
      formData.append('direccion',this.registroForm.get('direccion').value);
      formData.append('tipoVivienda',this.registroForm.get('tipoVivienda').value);
      formData.append('tienmpoVivienda',this.registroForm.get('tienmpoVivienda').value);
      formData.append('conquienVives',this.registroForm.get('conquienVives').value);
      formData.append('estrato',this.registroForm.get('estrato').value);
      formData.append('genero',this.registroForm.get('genero').value);
      formData.append('fechaNacimiento',this.registroForm.get('fechaNacimiento').value);
      formData.append('estadoCivil',this.registroForm.get('estadoCivil').value);
      formData.append('personasaCargo',this.registroForm.get('personasaCargo').value);
      formData.append('nCedula',this.registroForm.get('nCedula').value)
      formData.append('fechaExpedicionCedula',this.registroForm.get('fechaExpedicionCedula').value);
      formData.append('cc_anverso', (this.anverso != null ? this.anverso : ''));
      formData.append('cc_reverso', (this.reverso != null ? this.reverso : ''));
      formData.append('selfie', (this.selfie != null ? this.selfie : ''));
      formData.append('nHijos',this.registroForm.get('nHijos').value);
      formData.append('tipoPlanMovil',this.registroForm.get('tipoPlanMovil').value);
      formData.append('nivelEstudio',this.registroForm.get('nivelEstudio').value);
      formData.append('estadoEstudio',this.registroForm.get('estadoEstudio').value);
      formData.append('vehiculo',this.registroForm.get('vehiculo').value);
      formData.append('placa',this.registroForm.get('placa').value)
      formData.append('nombre_anverso',this.registroForm.get('nombre_anverso').value)
      formData.append('nombre_reverso',this.registroForm.get('nombre_reverso').value)
      formData.append('nombre_selfie',this.registroForm.get('nombre_selfie').value)
      formData.append('id',this.basica_id_edit);
      formData.append('ciudads',this.registroForm.get('ciudads').value);
      formData.append('centralRiesgo',this.registroForm.get('centralRiesgo').value);
      formData.append('nroPersonasDependenEconomicamente', this.registroForm.get('nroPersonasDependenEconomicamente').value);
      formData.append('cotizasSeguridadSocial', this.registroForm.get('cotizasSeguridadSocial').value);
      formData.append('tipoAfiliacion', this.registroForm.get('tipoAfiliacion').value);
      formData.append('eps', this.registroForm.get('eps').value);
      formData.append('entidadReportado', this.registroForm.get('entidadReportado').value);
      formData.append('cualEntidadReportado', this.registroForm.get('cualEntidadReportado').value);
      formData.append('valorMora', this.registroForm.get('valorMora').value);
      formData.append('tiempoReportado', this.registroForm.get('tiempoReportado').value);
      formData.append('estadoReportado', this.registroForm.get('estadoReportado').value);
      formData.append('motivoReportado', this.registroForm.get('motivoReportado').value);
      formData.append('comoEnterasteNosotros', this.registroForm.get('comoEnterasteNosotros').value);
      const id = this.basica_id_edit;
      this.countriesService.update(id, formData).subscribe(response => {
        this.submitted = false;
        this.msjSubmit = false;
        if (response) {
          console.log(response)
           this.toast.success('Actualizado Correctamente');
           this.obtenerDato();
           if(numero==2){
             if(this.isAdmin){
              this.router.navigate(['/home/referencia/list/',this.basica_id_edit]);
             }else{
              this.router.navigate(['/home/referencia/list']);
             }
            }else if(numero==3){
              if(this.isAdmin){
                this.router.navigate(['/home/financiera/list/',this.basica_id_edit]);
               }else{
                this.router.navigate(['/home/financiera/list']);
               }
            }
        } else {
          console.log(response)
          this.toast.error('Error');
          this.toast.error(JSON.stringify(response));
        }
      });
    }else{
      this.modalSeguro2();
      return;
      console.log(this.registroForm);
    }
    // console.log(this.formUser.value);
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
  clientSelected(country) {
    if (country) {
 
      this.registroForm.controls['ciudad'].setValue(country['name']);
      console.log(this.registroForm.value)
    }
  }
  async onFileChange(event,a) {
    const reader = new FileReader();
    let fileList: FileList = event.target.files;
    let uploadedImage: Blob;
    if(event.target.files && event.target.files.length) {
      
      const [file2] = event.target.files;
      let file: File = fileList[0];
      reader.readAsDataURL(file2);
      // console.log(file);
          if(a == 'cc_anverso'){
            reader.onload = () => {
              this.imgAnverso = reader.result;
            }
            this.isResize1 =true;
          }
          if(a == 'cc_reverso'){
            reader.onload = () => {
              this.imgReverso = reader.result;
            }
            this.isResize2 =true;
          }
          if(a == 'selfie'){
            reader.onload = () => {
              this.imgSelfie = reader.result;
            }
            this.isResize3 =true;
          }
          
          await this.ng2ImgMax.resizeImage(file, 600, 600).subscribe(
            result => {
              uploadedImage = result;
              if(a == 'cc_anverso'){
            
                this.anverso = uploadedImage;
                this.nameAnverso = file.name;
                if(this.nameAnverso){
                  this.mostrarcheckanverso=1;
    
                }
                // console.log(this.anverso)
              }
              if(a == 'cc_reverso'){
                this.reverso = uploadedImage;;
                this.nameReverso = file.name;
                if(this.nameReverso){
                  this.mostrarcheckreverso=1;
                  
                }
              }
              if(a == 'selfie'){
                this.selfie = uploadedImage;;
                this.nameSelfie = file.name;
                if(this.nameSelfie){
                  this.mostrarcheckselfi=1;
                }
              }
              // let d = this.registroForm.value;
              if(this.anverso){
                // var res = this.anverso.split(",");
                this.registroForm.controls['cc_anverso'].setValue(this.nameAnverso);
                this.registroForm.controls['nombre_anverso'].setValue(this.nameAnverso);
              }
              if(this.reverso){
                // var res = this.reverso.split(",");
                this.registroForm.controls['cc_reverso'].setValue(this.nameAnverso);
                this.registroForm.controls['nombre_reverso'].setValue(this.nameReverso);
              }
              if(this.selfie){
                // var res = this.selfie.split(",");
                this.registroForm.controls['selfie'].setValue(this.nameAnverso);
                this.registroForm.controls['nombre_selfie'].setValue(this.nameSelfie);
              }
              this.isResize1=false
              this.isResize2=false
              this.isResize3=false
            },
            error => {
              this.isResize1=false
              this.isResize2=false
              this.isResize3=false
              console.log('Oh no!', error);
            }
          );

        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
        // };
        // console.log(this.registroForm.value);
    }
  }

  obtenerContraoferta(params){
    // let respuesta;
    // respuesta=this.requestService.consultaContraoferta(params);
    // console.log("respuesta",respuesta);


    this.requestService.consultaContraoferta(params).subscribe(response => {
      if (response) {
        console.log("resultado",JSON.parse(JSON.stringify(response)).total)
        if(JSON.parse(JSON.stringify(response)).total==1){
          
          let contraOferta = JSON.parse(JSON.stringify(response)).data;
          this.contraOfertaForm.controls['id'].setValue(contraOferta.id);
          let montoSolicitado = formatNumber(contraOferta.montoSolicitado, 'es')
          let montoAprobado = formatNumber(contraOferta.montoAprobado, 'es')
          let tasaInteres = formatNumber(contraOferta.tasaInteres, 'es')
          let subtotal = formatNumber(contraOferta.subtotal, 'es')
          let plataforma = formatNumber(contraOferta.plataforma, 'es')
          let aprobacionRapida = formatNumber(contraOferta.aprobacionRapida, 'es')
          let iva = formatNumber(contraOferta.iva, 'es')
          let totalPagar = formatNumber(contraOferta.totalPagar, 'es')
          this.tablaContraOferta = '<div class="row"><div class="col-md-12" style="margin:auto;"><table class="table table-bordered table-striped"><tbody><tr><th>Monto Solicitado</th><td>$ '+montoSolicitado+'</td></tr><tr><th>Monto Aprobado</th><td>$ '+montoAprobado+'</td></tr><tr><th>Tasa de interes</th><td>$ '+tasaInteres+'</td></tr><tr><th>Subtotal</th><td>$ '+subtotal+'</td></tr><tr><th>Plataforma</th><td>$ '+plataforma+'</td></tr><tr><th>Aprobación rapida</th><td>$ '+aprobacionRapida+'</td></tr><tr><th>IVA</th><td>$ '+iva+'</td></tr><tr><th>Total a pagar</th><td>$ '+totalPagar+'</td></tr></tbody></table></div></div>'
          // this.open();
          let el = document.getElementById("menutito");
          el.classList.add("ocultando")
          // console.log("nohay",el)
          this.router.navigate(['/credit/contra-ofertas']);
        }else{
          let el = document.getElementById("menutito");
          el.classList.remove('ocultando');
        }
        // this.toast.success("Datos guardados con exito!");
        // this.router.navigate(['/admin/evaluacion/',this.activatedRoute.snapshot.params.evaluacion]);
      } else {
        console.log("no hay respuesta");
      }
    },(error)=>
    {
      // this.toast.error("Error inesperado!");
      console.log("error");
    });
  }

  open() {
   
    this.modalService.open(this.content, { size: 'lg',backdrop: 'static',backdropClass: 'light-blue-backdrop' }).result.then((result) => {
       this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
       this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  logout() {
    this.auth.logout().then(response => {
      if (response) {
        this.toast.success(response['message']);
        let ruta = environment.webUrl;
        window.open(ruta+'/logout', "_self");
        // this.router.navigate(['https://www.creditospanda.com/front/']);
      } else {
        this.toast.error(JSON.stringify(response));
      }
       console.log(response);
       
    });
  }

  setFechaNueva(event){
    let d = '';
    if(event.day < 10){
      d='0'+event.day;
    }else{
      d=event.day;
    }
    let m = '';
    if(event.month < 10){
      m='0'+event.month;
    }else{
      m=event.month;
    }
  var fecha = event.year+'-'+m+'-'+d;
    this.contraOfertaForm.controls['fechaAceptado'].setValue(fecha);
    console.log(this.contraOfertaForm.value);
  }

  editCo(){
    if(this.contraOfertaForm.valid){
      this.requestService.editarContraOferta(this.contraOfertaForm.value).subscribe((res)=>{
        console.log(res)
        this.toast.success("Contra credito aceptado");
        this.modalService.dismissAll();
        this.router.navigate(['/home']);

      },(error)=>{
        console.log(error)
        return false;
      })
    }
  }

  seguridadSocial(value){
    if(value == 'Si'){
      this.segSoc = true;
      this.registroForm.get("tipoAfiliacion").setValidators([Validators.required]);
      this.registroForm.get("tipoAfiliacion").updateValueAndValidity();
      this.registroForm.get("eps").setValidators([Validators.required]);
      this.registroForm.get("eps").updateValueAndValidity();
    }else{
      this.segSoc = false;
      this.registroForm.get("tipoAfiliacion").clearValidators();
      this.registroForm.get("tipoAfiliacion").updateValueAndValidity();
      this.registroForm.get("eps").clearValidators();
      this.registroForm.get("eps").updateValueAndValidity();
    }
  }

  reportadoCredito(value){
     
    if(value == 'Si'){
      this.reporCred = true;
      this.registroForm.get("entidadReportado").setValidators([Validators.required]);
      this.registroForm.get("entidadReportado").updateValueAndValidity();
      this.registroForm.get("valorMora").setValidators([Validators.required]);
      this.registroForm.get("valorMora").updateValueAndValidity();
      this.registroForm.get("tiempoReportado").setValidators([Validators.required]);
      this.registroForm.get("tiempoReportado").updateValueAndValidity();
      this.registroForm.get("estadoReportado").setValidators([Validators.required]);
      this.registroForm.get("estadoReportado").updateValueAndValidity();
      this.registroForm.get("motivoReportado").setValidators([Validators.required]);
      this.registroForm.get("motivoReportado").updateValueAndValidity();
    }else{
      this.reporCred = false;
      this.registroForm.get("entidadReportado").clearValidators();
      this.registroForm.get("entidadReportado").updateValueAndValidity();
      this.registroForm.get("valorMora").clearValidators();
      this.registroForm.get("valorMora").updateValueAndValidity();
      this.registroForm.get("tiempoReportado").clearValidators();
      this.registroForm.get("tiempoReportado").updateValueAndValidity();
      this.registroForm.get("estadoReportado").clearValidators();
      this.registroForm.get("estadoReportado").updateValueAndValidity();
      this.registroForm.get("motivoReportado").clearValidators();
      this.registroForm.get("motivoReportado").updateValueAndValidity();
    }
  }

  entidadRepor(value){
     
    if(value == 'Otros'){
      this.entidadOtros = true;
      this.registroForm.get("cualEntidadReportado").setValidators([Validators.required]);
      this.registroForm.get("cualEntidadReportado").updateValueAndValidity();
    }else{
      this.entidadOtros = false;
      this.registroForm.get("cualEntidadReportado").clearValidators();
      this.registroForm.get("cualEntidadReportado").updateValueAndValidity();
    }
  }

  valor_mora(value: string) {
    // ing_mensuales
    if(value == '0'){
      this.registroForm.controls["valorMora"].setValue(' ');
    }else{
      this.registroForm.controls["valorMora"].setValue(value);
    }
    
  console.log(value)
    let val = parseInt(value, 10);
    if (Number.isNaN(val)) {
      val = 0;
    }
    this.cantidad = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'),'','1.0-0');
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
