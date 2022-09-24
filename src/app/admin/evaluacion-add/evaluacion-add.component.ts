import { Component, OnInit, ChangeDetectorRef, Injectable,Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule  } from '@angular/forms';
import { CountryService } from '../../shared/services/country.service';
import * as Moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { environment } from "../../../environments/environment";
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { switchMap } from 'rxjs/operators';
import { of, from, Observable } from 'rxjs';
import { registerLocaleData, formatCurrency, getCurrencySymbol } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { EvaluacionService } from 'app/shared/services/evaluacion.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ComentariosService } from 'app/shared/services/comentarios.service';
import swal from 'sweetalert2';
import { ConfigCalculadoraService } from 'app/shared/services/config-calculadora.service';
import {NgbDatepickerI18n, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
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
  selector: 'app-evaluacion-add',
  templateUrl: './evaluacion-add.component.html',
  styleUrls: ['./evaluacion-add.component.scss']
})
export class EvaluacionAddComponent implements OnInit {

  @Input() external_evaluacion_id: number;
  @Input() external: boolean = false;

  @Output() closeExternalId: EventEmitter<boolean>;
  @Output() openExternalModal: EventEmitter<any>;

  configuraciones2$: Observable<any[]>;
  ruta = environment.apiBase+"/storage/app/public/"
  configIngreso$: Observable<any[]>;
  currentJustify = 'fill';
  registroForm: FormGroup;
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
  adicionales = [];
  solicitudes;
  rutaGral;
  imgSelfie = null
  imgAnverso = null
  imgReverso = null
  isResize1 =false
  isResize2 =false
  isResize3 =false
  idUser;
  idSolicitudFk;
  revisionSelfie;
  revisionBalance;
  solicituds;
  formConfig: FormGroup;
  formBalance: FormGroup;
  formIdentidad: FormGroup;
  formAdicionales: FormGroup;
  formLlamada: FormGroup;
  formDc: FormGroup;
  formDataCredito: FormGroup;
  formDataCreditoAlerta: FormGroup;
  formDataCreditoEndeudamiento: FormGroup;
  formDataCreditoPorSector: FormGroup;
  formExtractoBancario: FormGroup;
  formExtractoBancarioCreditos: FormGroup;
  formExtractoBancarioPagos: FormGroup;
  formEb: FormGroup;
  closeResult: string;
  usuarioComentario;
comentSelfie 
comentIdentidad
comentAdicional
comentLlamada
comentDC
comentEB
informacion;
  photoZoomWrapper: any;
  zoomContainerWidth: any;
  zoomContainerHeight: number;
  calculoIngreso = {
    alojamiento:{porcentaje:0,total:0},
    alimentos:{porcentaje:0,total:0},
    servicios_publicos:{porcentaje:0,total:0},
    transporte:{porcentaje:0,total:0},
    vestido:{porcentaje:0,total:0},
    recreacion:{porcentaje:0,total:0},
    muebles:{porcentaje:0,total:0},
    bebidas_alcoholicas:{porcentaje:0,total:0},
    salud:{porcentaje:0,total:0},
    promedio_composicion_hogar:0,
    total:{porcentaje:0,total:0},
    aporte_hogar:0
  }
  gastoMonetario = {
    renta : 0,
    alimentacion:{total:0,per_capita:0},
    servicios:{total:0,per_capita:0},
    transporte:{total:0,per_capita:0},
    vestido:{total:0,per_capita:0},
    cotizacion_salud:0,
    totalEgresos:0,
    totalEgresosPAE:0,
    totalDisponible:0,
    diponibleEndeudamiento:0,
    balanceCajaDiasMinimo:0,
    balanceCajaDiasMaximo:0,
    balanceCajaMesesMinimo:0,
    balanceCajaMesesMaximo:0
  }
  personasaCargo = 0
  nroPersonasDependenEconomicamente=0
  totalRenta = 0
  configCODias
  configCOMeses
  idEvaluacion;
  cedula;
  fechaNacimiento;
  porplataformaDias;
  porIvaDias;
  tasaDias;
  porExpressDias;
  plazoDias;
  montoSolicitadoDias;
  t_interesDias;
  subtotalDias;
  plataformaDias;
  ivaDias;
  totalDias;
  ap_expressDias;
  taxInTotal;
  subtotal;
  montoSolicitado;
  t_interes;
  cuotaMensual;
  total;
  iva;
  plataforma;
  ap_express;
  porplataformaMeses;
  porIvaMeses;
  tasaMeses;
  porExpressMeses;
  porExpressDosMeses;
  porExpressTresMeses;
  configCalDias;
  montoRestDias;
  montoResTooltipDias;
  diasRestDias;
  plazoMeses;
  montoRestMeses;
  montoResTooltipMeses;
  diasRestMeses;
  configCalMeses;
  cuotaMensualMax = 0;
  cuotaMensualMin= 0;
  totalDiasMax: any;
  totalDiasMin: any;

  alertas$: Observable<any[]>;
  endeudamientos$: Observable<any[]>;
  porSector$: Observable<any[]>;
  pA =1;
  itemsPerPageA = 5;
  pE =1;
  itemsPerPageE = 5;
  pS =1;
  itemsPerPageS = 5;
  ingreso_estimado: string = '$0.00';
  ingreso_vs_cuota: string = '';
  cupo_inicial = '$0.00'
  saldo_actual = '$0.00'
  cuota_mensual = '$0.00'
  gastos_familiares = '$0.00'
  saldo_mora = '$0.00'
  disponible_mensual = '$0.00'
  disponible_endeudamiento = '$0.00'
  ingreso_mensual = '$0.00'
  genero
  eps
  regimen
  estadoAfiliado
  tipoAfiliado
  estatusCedula
  msj
  edad;
  ingreso_formulario: string;
  variacion_ingreso
  DataCreditoEstatus=""
  ExtratosBancarios=""
  selfieEstatus: any;
  identidadEstatus: any;
  adicionalesEstatus: any;
  ruafJson='{"personaVO":{"numeroDocumento":"ND1098XX","tipoDocumento":"01","pais":"CO","nombres":{"RUAF":{"primerNombre":"JUAN CARLOS TORRES ROJAS","tipoNombre":3}}},"reportVO":{"lstPensionados":{"lstPensionadosDetailsGroup":[{"tblPersona":{"tblPersonaGrpPersonaCollection":{"tblPersonaGrpPersona":[{"tipoIdentificacion":"CC ND1098XX","primerNombre":"JUAN CARLOS TORRES ROJAS","sexo":"MASCULINO"}]}},"tblSL":{"tblSLGrpSLCollection":{"tblSLGrpSL":[{"regimenSL":"SALUD: CONTRIBUTIVO","administradoraSL":"EPS SURA","fechaAfiliacionSL":"1999-03-15","estadoAfiliadoSL":"Activo","tipoAfiliadoSL":"Cotizante Principal","ubicacionAfiliacion":"Santander - BUCARAMANGA"}]}},"tblPensiones":{"tblPensionesGrpPensionesCollection":{"tblPensionesGrpPensiones":[{"regimen":"PENSIONES: AHORRO INDIVIDUAL","administradora":"ADMINISTRADORA DE FONDOS DE PENSIONES Y CESANTIA PROTECCION SA","estadoAfiliacion":"Activo cotizante","fechaAfiliacion":"1995-06-01","afiliacionSubsidiada":"No"}]}},"tblRiesgosProfesionales":{"tblRiesgosProfesionalesGrpRiegosProfesionalesCollection":{"tblRiesgosProfesionalesGrpRiegosProfesionales":[{"administradora":"INSTITUTO DE SEGUROS SOCIALES ISS RIESGOS PROFESIONALES","fechaAfiliacion":"1976-08-20","actividadEconomicaRiesgo":"EMPRESAS DEDICADAS A ACTIVIDADES LEGISLATIVAS DE LA ADMINISTRACION PUBLICA EN GENERAL INCLUYE AL CONGRESO DE LA REPÃšBLICA","departamentoLaboralRP":"BogotÃ¡, D.C. - BOGOTÃ","estadoAfiliacion":"Inactiva","regimen":"RIESGOS PROFESIONALES : SISTEMA GENERAL DE RIESGOS PROFESIONALES"}]}},"tblCompensacionFamiliar":{"tblCompensacionFamiliarGrpCompensacionFamiliarCollection":{"tblCompensacionFamiliarGrpCompensacionFamiliar":[{"tipoAfiliadoCF":"Trabajador afiliado dependiente","departamentoLaboralCF":"BogotÃ¡, D.C. - BOGOTÃ","fechaAfiliacion":"2002-08-16","estadoAfiliacion":"Inactivo","administradora":"CAJA DE COMPENSACION FAMILIAR CAFAM","tipoMPCCF":"Afiliado"}]}},"tblCesantias":{"tblCesantiasGrpCesantiasCollection":{"tblCesantiasGrpCesantias":[{"regimen":"CESANTIAS: TRADICIONAL","administradora":"FONDO NACIONAL DEL AHORRO","fechaAfiliacion":"1999-10-01","estadoAfiliacion":"VIGENTE","ubicacionLaboral":" - "}]}},"tblAsistenciaSocial":{"tblAsistenciaSocialGrpPersonaCollection":{"tblAsistenciaSocialGrpPersona":[{"tblAsistenciaSocialGrpAsistenciaSocialCollection":{"tblAsistenciaSocialGrpAsistenciaSocial":[{"fechaEntregaUltimoBeneficioAS":"2009-07-03","ubicacionEntregaBeneficio":"Santander - BUCARAMANGA","valorBeneficioAS":"","tipoSubsidio":"","estadoBeneficio":"Entregado","tipoBeneficio":"Economico","administradora":"INSTITUTO COLOMBIANO DE ESTUDIOS TECNICOS Y CREDITO EN EL EXTERIOR ICETEX","programa":"Subsidio a la Matricula  ","fechaVinculacion":"2009-03-30","estadoVinculacionAS":"Activo"}]}}]}},"tblPensionados":{"tblPensionadosGroup1Collection":{"tblPensionadosGroup1":[{"numeroResolucionPensionPG":"1620510","pensionCompartidaPG":"No","estadoPension":"Retirado","tipoPension":"Jubilacion","tipoPensionado":"Regimen de prima media sin tope mÃ¡ximo de pension","pagador":"CAJANAL EICE","fechaResolucion":"2010-09-30","modalidadPensionPG":"Regimen general"}]}}}]}},"fechaConsulta":"2017-05-06 10:48:31","fuenteFallo":"NO"}'
  ofacJson='{"personaVO":{"numeroDocumento":"ND1098XX","tipoDocumento":"01","pais":"CO","nombres":{"OFAC":{"primerNombre":"Winai","segundoNombre":"PICHAYOS","tipoNombre":2}}},"type":"Individual","program":"SDNTK","title":"","dateOfBirth":"01 Dec 1957","placeOfBirth":"","list":"SDN","nationality":"","citizenship":"","remarks":"","callSign":"","tonnage":"","registeredTonnage":"","vesselFlag":"","vesselType":"","vesselOwner":"","aliases":[{"type":"a.k.a.","category":"strong","name":"PITCHAYOS, Vinai"},{"type":"a.k.a.","category":"strong","name":"PHITCHAYOT, Winai"},{"type":"a.k.a.","category":"strong","name":"THICHAIYOT, Winai"},{"type":"a.k.a.","category":"strong","name":"PICHAYOS, Vinai"},{"type":"a.k.a.","category":"strong","name":"PICHAYOT, Vinai"},{"type":"a.k.a.","category":"strong","name":"PHITCHAIYOT, Winai"},{"type":"a.k.a.","category":"strong","name":"TICHYOS, Vinai"}],"identifications":[{"type":"Passport","id":"ND1098XX","country":"Thailand","issueDate":"","expireDate":""}],"tieneRegistro":"SI","fechaConsulta":"2017-05-12 10:00:43","fuenteFallo":"NO"}'
  estadoCedulaJson='{"personaVO":{"numeroDocumento":"ND1098XX","tipoDocumento":"01","pais":"CO","nombres":{"ESTADO-CEDULA-COLOMBIA":{"primerNombre":"JUAN CARLOS TORRES ROJAS","tipoNombre":3}}},"fechaExpedicion":"25 DE AGOSTO DE 1995","lugarExpedicion":"BUCARAMANGA - SANTANDER","estado":"VIGENTE","resolucion":"","fechaResolucion":"","fechaConsulta":"2017-05-05 16:07:13","fuenteFallo":"NO"}'
  antecedentesPenalesJson='{"personaVO":{"numeroDocumento":"ND1098XX","tipoDocumento":"01","pais":"CO","nombres":{"ANTECEDENTES-POLICIA":{"primerNombre":"TORRES ROJAS JUAN CARLOS","tipoNombre":3}}},"antecedentes":"ACTUALMENTE NO ES REQUERIDO POR AUTORIDAD JUDICIAL ALGUNA","fechaConsulta":"2017-05-05 15:38:00","fuenteFallo":"NO"}'
  ruaf
  bdua
  ofac
  estadoCedula
  antecedentesPenales
  submittedConsulta =false
  estatusSolicitud: any;
  situacion_laboral: any;
  //variables para extrato bancario
  saldo_anterior_eb='$0.00'
  total_abonos_eb='$0.00'
  total_abonos_eb_3='$0.00'
  total_cargos_eb='$0.00'
  total_cargos_eb_3='$0.00'
  saldo_actual_eb='$0.00'
  saldo_promedio_eb='$0.00'
  salario_eb='$0.00'
  valor_ingresos_ebp = '$0.00'
  total_mensual_ebp= '$0.00'
  promedio_ebp = '$0.00'
  ingresos_ebc = '$0.00'
  cuota_credito_ebc = '$0.00'
  valor_total_mensual_creditos_actuales_eb = '$0.00'
  extractos_bancarios
  extractos_bancarios_pagos
  extractos_bancarios_creditos
  extractos_bancarios_pagos_promedio =0
  extractos_bancarios_creditos_ingreso_credito =0
  extractos_bancarios_creditos_cuota_credito =0
  extractos_bancarios_creditos_resta_total =0
  tipoPagoNomina ='Mensual'
  gastoMonetarioAnalisis
  calculoIngresoAnalisis
  resultadoEmailAnalisis
  resultadoFiltroAnalisis
  resultadoScrappingAnalisis
  resultadoTelefonoAnalisis
  resultadoAnalizerAnalisis
  emailAnalisis
  filtroEstatus
  emailEstatus
  telefonoEstatus
  scrappingEstatus
  scrappingAnalisis:any=[]
  filtroAnalisis =[]
  analizerAnalisis
  analizerEstatus
 constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toast: ToastrService,
    private cd: ChangeDetectorRef,
    private countriesService: CountryService,
    private EvaluacionService: EvaluacionService,
    private modalService: NgbModal,
    private _modalService: NgbModal,
    private ComentariosService:ComentariosService,
    private ng2ImgMax: Ng2ImgMaxService,
    private configService: ConfigCalculadoraService,
  ) {
    this.configuraciones2$ = this.configService.configuraciones2$;
    this.formConfig = this.fb.group({
      id: [''],
      comentario_selfie:[''], 
      selfie:['', Validators.required],
      estatus:['', Validators.required],
      usuario: [''],
      fecha: [''],

    });
    this.formBalance = this.fb.group({
      id: [''],
      balance:['', Validators.required],
      estatus:['', Validators.required],
      usuario: [''],
      fecha: [''],

    });
    this.formIdentidad = this.fb.group({
      id: [''],
      comentario_identidad:[''], 
      identidad:['', Validators.required],
      estatus:['', Validators.required],
      usuario: [''],
      fecha: [''],

    });
    this.formAdicionales = this.fb.group({
      id: [''],
      comentario_adicionales:[''], 
      adicionales:['', Validators.required],
      estatus:['', Validators.required],
      usuario: [''],
      fecha: [''],

    });
    this.formLlamada = this.fb.group({
      id: [''],
      comentario_llamada:[''], 
      llamada:['', Validators.required],
      estatus:['', Validators.required],
      usuario: [''],
      fecha: [''],

    });
    this.formDc = this.fb.group({
      id: [''],
      data_credito:['', Validators.required],
      estatus:['', Validators.required],
      usuario: [''],
      fecha: [''],

    });
    this.formEb = this.fb.group({
      id: [''],
      extracto_bancario:['', Validators.required],
      estatus:['', Validators.required],
      usuario: [''],
      fecha: [''],

    });
    this.formDataCredito = this.fb.group({
      id: [''],
      idEvaluacion: [''],
      estadoDocumento: [false],
      nroCedula: [false],
      fechaExpedicion: [false],
      genero: [false],
      rangoEdad: [false],
      estadoDocumentoAp: [false],
      nroCedulaAp: [false],
      fechaExpedicionAp: [false],
      generoAp: [false],
      rangoEdadAp: [false],
      estadoDocumentoDe: [false],
      nroCedulaDe: [false],
      fechaExpedicionDe: [false],
      generoDe: [false],
      rangoEdadDe: [false],
      situacionLaboral: [''],
      ingresoVsCuota: [''],
      ingresoEstimado: [''],
      bajo: [false],
      medio:[false],
      alto:[false],
      puntajeBajo:[''],
      puntajeMedio:[''],
      puntajeAlto:['']

    });

    this.formDataCreditoAlerta = this.fb.group({
      id: [''],
      idEvaluacion: [''],
      fuente: ['',Validators.required],
      fecha: ['',Validators.required],
      fechaS:[''],
      novedad: [''],
      descripcion: ['',Validators.required]

    });

    this.formDataCreditoEndeudamiento = this.fb.group({
      id: [''],
      idEvaluacion: [''],
      mes: ['',Validators.required],
      mora: ['',Validators.required]

    });
    this.formDataCreditoPorSector = this.fb.group({
      id: [''],
      idEvaluacion: [''],
      cupoInicial: ['',Validators.required],
      saldoActual: ['',Validators.required],
      cuotaMensual: ['',Validators.required],
      gastosFamiliares: ['',Validators.required],
      saldoMora: ['',Validators.required],
      disponibleMensual: ['',Validators.required],
      disponibleEndeudamiento: ['',Validators.required],
      ingresoMensual: ['',Validators.required]

    });
    this.formExtractoBancario= this.fb.group({
      id:[''],
      idEvaluacion:[''],
      saldoAnterior: ['',Validators.required],
      totalAbonos: ['',Validators.required],
      totalCargos: ['',Validators.required],
      saldoActual: ['',Validators.required],
      saldoPromedio: ['',Validators.required],
      salario: ['',Validators.required],
      diasPago: ['',Validators.required],
      nombreEmpresa: ['',Validators.required],
      tipoContrato: ['',Validators.required],
      antiguedadLaboral: ['',Validators.required],
      nombreCargo: ['',Validators.required],
      valorTotalMensualCreditosActuales: ['',Validators.required]

    });
    this.formExtractoBancarioCreditos= this.fb.group({
      id:[''],
      idEvaluacion:[''],
      fechaebc: ['',Validators.required],
      fecha: ['',Validators.required],
      empresa: ['',Validators.required],
      ingresoPrestamo: ['',Validators.required],
      cuotaCredito: ['',Validators.required],

    });
    this.formExtractoBancarioPagos= this.fb.group({
      id:[''],
      idEvaluacion:[''],
      fechaebp: ['',Validators.required],
      fecha: ['',Validators.required],
      concepto: ['',Validators.required],
      valorIngreso: ['',Validators.required],
      totalMensual: [0,Validators.required],
      promedio: [0,Validators.required],

    });
    this.configIngreso$ = this.EvaluacionService.configIngreso$;
    this.alertas$ = this.EvaluacionService.alertas$;
    this.endeudamientos$ = this.EvaluacionService.endeudamientos$;
    this.porSector$ = this.EvaluacionService.porSector$;
    this.closeExternalId = new EventEmitter();
    this.openExternalModal = new EventEmitter();
   }
  ngOnInit() {
    registerLocaleData(localeEs, 'es');
    this.configService.getContraofertas({page:1,per_page:10});
    this.getCODias()
    this.getCOMeses()
    this.configDias()
    this.configMeses()
    this.comentariosAdicional()
    this.comentariosLlamada()
    this.comentariosSelfie()
    this.comentariosIdentidad()
    this.comentariosDC()
    this.comentariosEB()
   
    this.usuarioComentario=JSON.parse(localStorage.getItem('user')).first_name+' '+JSON.parse(localStorage.getItem('user')).last_name
    console.log('revisionselfie',this.revisionSelfie)
    
    this.EvaluacionService.getIngresoActividadAll({page:1,per_page:100});
    // console.log("Ingreso",this.configIngreso$);
    if (this.external) {
      this.idEvaluacion = this.external_evaluacion_id
      // console.log("ids",params)
      this.formDataCredito.controls['idEvaluacion'].setValue(this.external_evaluacion_id)
          this.formDataCreditoAlerta.controls['idEvaluacion'].setValue(this.external_evaluacion_id)
          this.formDataCreditoEndeudamiento.controls['idEvaluacion'].setValue(this.external_evaluacion_id)
          this.formDataCreditoPorSector.controls['idEvaluacion'].setValue(this.external_evaluacion_id)
          this.formExtractoBancario.controls['idEvaluacion'].setValue(this.external_evaluacion_id);
          this.formExtractoBancarioPagos.controls['idEvaluacion'].setValue(this.external_evaluacion_id);
          this.formExtractoBancarioCreditos.controls['idEvaluacion'].setValue(this.external_evaluacion_id);
          this.EvaluacionService.alertasAll({page:1,per_page:5,id:this.external_evaluacion_id});
          this.EvaluacionService.endeudamientoAll({page:1,per_page:5,id:this.external_evaluacion_id});
          this.EvaluacionService.porSectorAll({page:1,per_page:5,id:this.external_evaluacion_id});
          this.EvaluacionService.show(this.external_evaluacion_id).subscribe(async (blog)=>{
            if (blog) {
              console.log('BLOG=>>>>', blog)
                   this.idUser=JSON.parse(JSON.stringify(blog)).idUserFk
                   this.revisionSelfie=blog;
                   this.revisionBalance = JSON.parse(JSON.stringify(blog)).balance
                   this.DataCreditoEstatus = JSON.parse(JSON.stringify(blog)).data_credito
                   this.ExtratosBancarios = JSON.parse(JSON.stringify(blog)).extracto_bancario
                   this.selfieEstatus = JSON.parse(JSON.stringify(blog)).selfie
                   this.identidadEstatus = JSON.parse(JSON.stringify(blog)).verifiquese
                   this.adicionalesEstatus = JSON.parse(JSON.stringify(blog)).adicionales
                   this.filtroEstatus = JSON.parse(JSON.stringify(blog)).filtro
                   this.emailEstatus = JSON.parse(JSON.stringify(blog)).email
                   this.telefonoEstatus = JSON.parse(JSON.stringify(blog)).telefono
                   this.scrappingEstatus = JSON.parse(JSON.stringify(blog)).scrapping
                   this.analizerEstatus = JSON.parse(JSON.stringify(blog)).analizer
                   if(JSON.parse(JSON.stringify(blog)).informacion_identidad){
                     this.informacion=JSON.parse(JSON.parse(JSON.stringify(blog)).informacion_identidad).result;
                       console.log("Inforamcion=>", this.informacion)
                      //  this.ruaf = JSON.parse(this.informacion.ruaf)
                      this.bdua = this.informacion.bdua
                      this.ofac = this.informacion.ofac
                      this.estadoCedula =this.informacion.estadoCedula
                      this.antecedentesPenales = this.informacion.antecedentes
                       console.log("Inforamcion=>", this.bdua)
                   }
             
                   this.calculoIngresoAnalisis = JSON.parse(JSON.stringify(blog)).calculoIngreso
                   this.gastoMonetarioAnalisis = JSON.parse(JSON.stringify(blog)).gastoMonetario
                   this.resultadoEmailAnalisis = JSON.parse(JSON.stringify(blog)).resultadoEmail
                   this.resultadoFiltroAnalisis = JSON.parse(JSON.stringify(blog)).resultadoFiltro
                   this.resultadoScrappingAnalisis = JSON.parse(JSON.stringify(blog)).resultadoScrapping
                   this.resultadoTelefonoAnalisis = JSON.parse(JSON.stringify(blog)).resultadoTelefono
                   this.resultadoAnalizerAnalisis = JSON.parse(JSON.stringify(blog)).resultadoAnalizer
             
                   this.filtroAnalisis = JSON.parse(this.resultadoFiltroAnalisis);
                   this.scrappingAnalisis =JSON.parse(this.resultadoScrappingAnalisis);
                   this.emailAnalisis=this.resultadoEmailAnalisis;
                   this.analizerAnalisis=JSON.parse(this.resultadoAnalizerAnalisis);
                   this.formConfig.controls['comentario_selfie'].setValue(JSON.parse(JSON.stringify(blog)).comentario_selfie);  
                   this.formIdentidad.controls['comentario_identidad'].setValue(JSON.parse(JSON.stringify(blog)).comentario_identidad); 
                   this.formAdicionales.controls['comentario_adicionales'].setValue(JSON.parse(JSON.stringify(blog)).comentario_adicionales);
                   this.formLlamada.controls['comentario_llamada'].setValue(JSON.parse(JSON.stringify(blog)).comentario_llamada);  
                           await this.obtenerDato(this.idUser)
                      
                      console.log('datos lbog',this.revisionSelfie) 
                   this.idSolicitudFk=JSON.parse(JSON.stringify(blog)).idSolicitudFk
                      this.obtenerSolicitud(this.idSolicitudFk)
             
                      
                   }
          },(error)=>{
            console.log(error)
          })

    }else{
    this.activatedRoute.params
    .pipe(
      switchMap(params => {
        if (params['id']) {
          this.idEvaluacion=params['id']
          this.formDataCredito.controls['idEvaluacion'].setValue(params['id'])
          this.formDataCreditoAlerta.controls['idEvaluacion'].setValue(params['id'])
          this.formDataCreditoEndeudamiento.controls['idEvaluacion'].setValue(params['id'])
          this.formDataCreditoPorSector.controls['idEvaluacion'].setValue(params['id'])
          this.formExtractoBancario.controls['idEvaluacion'].setValue(params['id']);
          this.formExtractoBancarioPagos.controls['idEvaluacion'].setValue(params['id']);
          this.formExtractoBancarioCreditos.controls['idEvaluacion'].setValue(params['id']);
          this.EvaluacionService.alertasAll({page:1,per_page:5,id:params['id']});
          this.EvaluacionService.endeudamientoAll({page:1,per_page:5,id:params['id']});
          this.EvaluacionService.porSectorAll({page:1,per_page:5,id:params['id']});
          return this.EvaluacionService.show(params['id']);
        } else {
          return of(null);
        }
      })
    )
    .subscribe(async blog => {
      if (blog) {
 console.log('BLOG=>>>>', blog)
      this.idUser=JSON.parse(JSON.stringify(blog)).idUserFk
      this.revisionSelfie=blog;
      this.revisionBalance = JSON.parse(JSON.stringify(blog)).balance
      this.DataCreditoEstatus = JSON.parse(JSON.stringify(blog)).data_credito
      this.ExtratosBancarios = JSON.parse(JSON.stringify(blog)).extracto_bancario
      this.selfieEstatus = JSON.parse(JSON.stringify(blog)).selfie
      this.identidadEstatus = JSON.parse(JSON.stringify(blog)).verifiquese
      this.adicionalesEstatus = JSON.parse(JSON.stringify(blog)).adicionales
      this.filtroEstatus = JSON.parse(JSON.stringify(blog)).filtro
      this.emailEstatus = JSON.parse(JSON.stringify(blog)).email
      this.telefonoEstatus = JSON.parse(JSON.stringify(blog)).telefono
      this.scrappingEstatus = JSON.parse(JSON.stringify(blog)).scrapping
      if(JSON.parse(JSON.stringify(blog)).informacion_identidad){
        this.informacion=JSON.parse(JSON.parse(JSON.stringify(blog)).informacion_identidad).result;
          console.log("Inforamcion=>", this.informacion)
          // this.ruaf = JSON.parse(this.informacion.ruaf)
          this.bdua = JSON.parse(this.informacion.bdua)
          this.ofac = JSON.parse(this.informacion.ofac)
          this.estadoCedula = JSON.parse(this.informacion.estadoCedula)
          this.antecedentesPenales = JSON.parse(this.informacion.antecedentes)
          // console.log("Inforamcion=>", this.ruaf)
      }

      this.calculoIngresoAnalisis = JSON.parse(JSON.stringify(blog)).calculoIngreso
      this.gastoMonetarioAnalisis = JSON.parse(JSON.stringify(blog)).gastoMonetario
      this.resultadoEmailAnalisis = JSON.parse(JSON.stringify(blog)).resultadoEmail
      this.resultadoFiltroAnalisis = JSON.parse(JSON.stringify(blog)).resultadoFiltro
      this.resultadoScrappingAnalisis = JSON.parse(JSON.stringify(blog)).resultadoScrapping
      this.resultadoTelefonoAnalisis = JSON.parse(JSON.stringify(blog)).resultadoTelefono
      this.resultadoAnalizerAnalisis = JSON.parse(JSON.stringify(blog)).resultadoAnalizer

      this.filtroAnalisis = JSON.parse(this.resultadoFiltroAnalisis);
      this.scrappingAnalisis=JSON.parse(this.resultadoScrappingAnalisis);
      this.emailAnalisis=JSON.parse(this.resultadoEmailAnalisis);
      this.analizerAnalisis=JSON.parse(this.resultadoAnalizerAnalisis);
      this.formConfig.controls['comentario_selfie'].setValue(JSON.parse(JSON.stringify(blog)).comentario_selfie);  
      this.formIdentidad.controls['comentario_identidad'].setValue(JSON.parse(JSON.stringify(blog)).comentario_identidad); 
      this.formAdicionales.controls['comentario_adicionales'].setValue(JSON.parse(JSON.stringify(blog)).comentario_adicionales);
      this.formLlamada.controls['comentario_llamada'].setValue(JSON.parse(JSON.stringify(blog)).comentario_llamada);  
              await this.obtenerDato(this.idUser)
         
         console.log('datos lbog',this.revisionSelfie) 
      this.idSolicitudFk=JSON.parse(JSON.stringify(blog)).idSolicitudFk
         this.obtenerSolicitud(this.idSolicitudFk)

         
      }
    });
  }
    
  }
  isObject(val): boolean { return typeof val === 'object'; }
  obtenerDato(usuario){
    // params["id"] = modo_edición

    
    if (usuario) {
      console.log("aqui",usuario)
        // this.basica_id_edit = usuario.id;
      
      this.countriesService.getBasica({id:usuario}).subscribe(response => {
        console.log("aqui",response)
          this.basicas=JSON.parse(JSON.stringify(response)).basica;
        this.user=JSON.parse(JSON.stringify(response)).usuario;
        this.referencias=JSON.parse(JSON.stringify(response)).referencia;
        this.financieras=JSON.parse(JSON.stringify(response)).financiera;
        this.situacion_laboral = this.financieras ? this.financieras.situacionLaboral.trim(): '';
        this.adicionales=JSON.parse(JSON.stringify(response)).adicional;
        this.solicitudes=JSON.parse(JSON.stringify(response)).solicitud;
        this.imgAnverso = this.basicas ? this.ruta+this.basicas.anversoCedula : '';
        this.imgReverso=this.basicas ? this.ruta+this.basicas.reversoCedula : '';
        this.imgSelfie= this.basicas ? this.ruta+this.basicas.selfi :'';
        this.edad = this.basicas ? Moment().diff(this.basicas.fechaNacimiento, 'years',false) : 0;
        console.log('Edad =>',this.edad)
this.cedula= this.basicas ? JSON.parse(JSON.stringify(this.basicas)).nCedula : '';
this.fechaNacimiento= this.basicas ? JSON.parse(JSON.stringify(this.basicas)).fechaNacimiento : '';
if(this.financieras){
  this.total_salario_eb(this.financieras.ingresoTotalMensual.toString());
  // let dp = this.financieras.diasPago
  // let dp1= JSON.parse(dp)
  // let dpf =''
  // let d
  // dp1.forEach(element => {
  //   dpf = dpf+element.name+','
  // });
  // d=dpf.slice(0, -1)

  this.formExtractoBancario.controls['diasPago'].setValue(this.financieras.periodoPagoNomina)
  this.formExtractoBancario.controls['tipoContrato'].setValue(this.financieras.situacionLaboral)
  this.formExtractoBancario.controls['nombreEmpresa'].setValue(this.financieras.nombreEmpresa)
  this.formExtractoBancario.controls['antiguedadLaboral'].setValue(this.financieras.antiguedadLaboral)
  this.formExtractoBancario.controls['nombreCargo'].setValue(this.financieras.nombreCargo)
  // this.formExtractoBancario.controls['valorTotalMensualCreditosActuales'].setValue(this.financieras.pagandoActual)
  if(this.financieras.pagandoActual){
    console.log("PAGANDO",this.financieras.pagandoActual)
    this.total_valor_total_mensual_creditos_actuales_eb(this.financieras.pagandoActual.toString());
  }
  
}
// this.obtenerInformacion(this.cedula,this.fechaNacimiento) 
        if(this.basicas){
          if(this.basicas.nroPersonasDependenEconomicamente == "Ninguna"){
            this.nroPersonasDependenEconomicamente = 0
          }else if(this.basicas.nroPersonasDependenEconomicamente == "Una Persona"){
            this.nroPersonasDependenEconomicamente = 1
          }else if(this.basicas.nroPersonasDependenEconomicamente == "Dos Personas"){
            this.nroPersonasDependenEconomicamente = 2
          }else if(this.basicas.nroPersonasDependenEconomicamente == "Tres Personas"){
            this.nroPersonasDependenEconomicamente = 3
          }else if(this.basicas.nroPersonasDependenEconomicamente == "Mas de Tres Personas"){
            this.nroPersonasDependenEconomicamente = 4
          }
        
        if(this.basicas.personasaCargo == "Ninguna"){
          this.personasaCargo = 0
        }else if(this.basicas.personasaCargo == "Una Persona"){
          this.personasaCargo = 1
        }else if(this.basicas.personasaCargo == "Dos Personas"){
          this.personasaCargo = 2
        }else if(this.basicas.personasaCargo == "Tres Personas"){
          this.personasaCargo = 3
        }else if(this.basicas.personasaCargo == "Mas de Tres Personas"){
          this.personasaCargo = 4
        }
      }
        this.getDataCredito();
        this.calcularIngresoActividad();
        this.estratoAlojamiento();
        this.getEB()
        this.getEBP()
        this.getEBC()
        
        if(response['msj']){

        }else{
        // Object.keys(response["basica"]).forEach(key => {
  
          // if (this.registroForm.controls[key]) {
          //   // console.log(this.registroForm.controls[key])
          //   this.registroForm.controls[key].setValue(response["basica"][key]);
          //   // this.tasksForm.controls['expiration_date'].setValue(Moment(response['expiration_date']).format('YYYY-MM-DD'));
          // }
        // });
        // Object.keys(response["usuario"]).forEach(key => {
  
          // if (this.registroForm.controls[key]) {
          //   // console.log(this.registroForm.controls[key])
          //   this.registroForm.controls[key].setValue(response["usuario"][key]);
          //   // this.tasksForm.controls['expiration_date'].setValue(Moment(response['expiration_date']).format('YYYY-MM-DD'));
          // }
        // });
        if(response["basica"] && response["basica"]["anversoCedula"]){
          this.imgAnverso = this.ruta+response["basica"]["anversoCedula"];
        }
        if(response["basica"] && response["basica"]["reversoCedula"]){
          this.imgReverso = this.ruta+response["basica"]["reversoCedula"];
        }
        if(response["basica"] && response["basica"]["selfi"]){
          this.imgSelfie = this.ruta+response["basica"]["selfi"];
        }

        }
        
        


      });
    } 
}
obtenerSolicitud(idsolicitud){

  this.EvaluacionService.showSolicitud(idsolicitud).subscribe(response => {

     this.solicituds=response;
     this.estatusSolicitud = this.solicituds.estatus;
    console.log('solicitud==>',response)
 

});

}
obtenerInformacion(cedula,fecha){
console.log('informacion entre',cedula);
console.log('informacion entre',fecha);
this.submittedConsulta =true;
  this.countriesService.getInformacion({nCedula:cedula,fechaNacimiento:fecha,idEvaluacion:this.idEvaluacion}).subscribe(response => {

     this.informacion=JSON.parse(JSON.stringify(response)).result;
    //  localStorage.setItem('info_servicio',this.informacion);
    // console.log("Inforamcion=>", this.informacion)
    this.ruaf = JSON.parse(this.informacion.ruaf)
    this.ofac = JSON.parse(this.informacion.ofac)
    this.estadoCedula = JSON.parse(this.informacion.estadoCedula)
    this.antecedentesPenales = JSON.parse(this.informacion.antecedentes)
    
    this.submittedConsulta=false
    // console.log(this.estadoCedula.personaVO.nombres)
 

});

}
aceptarSelfie(evaluacion){
  this.formConfig.controls['id'].setValue(evaluacion.id);
  this.formConfig.controls['selfie'].setValue('aprobado');
  this.formConfig.controls['estatus'].setValue('verificacion de identidad');
  if (this.formConfig.valid) {

    this.EvaluacionService.updateSelfie(this.formConfig.value).subscribe(response => {
      if (response) {
        this.toast.success("Aprobado exito!");
        this.selfieEstatus = "aprobado"
      } else {
        this.toast.error("Error inesperado!");
      }
    });
  }
}



comentarioSelfie(evaluacion){
  let fecha = new Date(); //Fecha actual
  let mes = fecha.getMonth()+1; //obteniendo mes
  let dia = fecha.getDate(); //obteniendo dia
  let ano = fecha.getFullYear(); //obteniendo año
  
 let fechaTotal= dia+'-'+mes+'-'+ano

  this.formConfig.controls['id'].setValue(evaluacion.id);
  this.formConfig.controls['fecha'].setValue(fechaTotal);
  this.formConfig.controls['usuario'].setValue(this.usuarioComentario);
  this.formConfig.controls['selfie'].setValue('aprobado');
  this.formConfig.controls['estatus'].setValue('verificacion de identidad');
  console.log('selfieRevision',this.revisionSelfie)
  // if (this.formConfig.valid) {

  //   this.EvaluacionService.comentarioSelfie(this.formConfig.value).subscribe(response => {
  //     if (response) {
  //       this.toast.success("Comentario guardado con exito!");
  //       this.ngOnInit()
  //     } else {
  //       this.toast.error("Error inesperado!");
  //     }
  //   });
  // }
}

rechazarSelfie(evaluacion){
  this.formConfig.controls['id'].setValue(evaluacion.id);
  this.formConfig.controls['selfie'].setValue('rechazado');
  this.formConfig.controls['estatus'].setValue('negado verificacion selfie');
  if (this.formConfig.valid) {

    this.EvaluacionService.updateSelfie(this.formConfig.value).subscribe(response => {
      if (response) {
        this.toast.error("Rechazado exitosamente!");
        this.selfieEstatus="rechazado"
      } else {
        this.toast.error("Error inesperado!");
      }
    });
  }
}


aceptarIdentidad(evaluacion,solicitud){
  console.log('identidadd',solicitud)
  this.formIdentidad.controls['id'].setValue(evaluacion.id);
  this.formIdentidad.controls['identidad'].setValue('aprobado');
  if(this.financieras.situacionLaboral.trim() == 'Independiente' || this.financieras.situacionLaboral.trim() == 'Pensionado' || this.financieras.situacionLaboral.trim() == 'Empleado/a por servicios'){
    this.formIdentidad.controls['estatus'].setValue('verificacion de datos adicionales');
  }else{
    this.formIdentidad.controls['estatus'].setValue('Esperando revision extractos bancarios');
  }
  
  if (this.formIdentidad.valid) {

    this.EvaluacionService.updateIdentidad(this.formIdentidad.value).subscribe(response => {
      if (response) {
        this.toast.success("Aprobado exito!");
        this.identidadEstatus = "aprobado"
      } else {
        this.toast.error("Error inesperado!");
      }
    });
  }
}

comentarioIdentidad(evaluacion){
  let fecha = new Date(); //Fecha actual
  let mes = fecha.getMonth()+1; //obteniendo mes
  let dia = fecha.getDate(); //obteniendo dia
  let ano = fecha.getFullYear(); //obteniendo año
  
 let fechaTotal= dia+'-'+mes+'-'+ano

  this.formIdentidad.controls['id'].setValue(evaluacion.id);
  this.formIdentidad.controls['fecha'].setValue(fechaTotal);
  this.formIdentidad.controls['usuario'].setValue(this.usuarioComentario);
  this.formIdentidad.controls['identidad'].setValue('aprobado');
  this.formIdentidad.controls['estatus'].setValue('verificacion de identidad');
  if (this.formIdentidad.valid) {

    this.EvaluacionService.comentarioIdentidad(this.formIdentidad.value).subscribe(response => {
      if (response) {
        this.toast.success("Comentario guardado con exito!");
        this.comentariosIdentidad()
      } else {
        this.toast.error("Error inesperado!");
      }
    });
  }
}

rechazarIdentidad(id){
  this.formIdentidad.controls['id'].setValue(id);
  this.formIdentidad.controls['identidad'].setValue('rechazado');
  this.formIdentidad.controls['estatus'].setValue('negado verificacion identidad');
  if (this.formIdentidad.valid) {

    this.EvaluacionService.updateIdentidad(this.formIdentidad.value).subscribe(response => {
      if (response) {
        this.toast.error("Rechazado identidad!");
        // this.ngOnInit()
        this.identidadEstatus="rechazado"
      } else {
        this.toast.error("Error inesperado!");
      }
    });
  }
}


aceptarAdicionales(evaluacion){
  this.formAdicionales.controls['id'].setValue(evaluacion.id);
  this.formAdicionales.controls['adicionales'].setValue('aprobado');
  this.formAdicionales.controls['estatus'].setValue('Esperando revision extractos bancarios');
  if (this.formAdicionales.valid) {

    this.EvaluacionService.updateAdicionales(this.formAdicionales.value).subscribe(response => {
      if (response) {
        this.toast.success("Aprobado exito!");
        this.adicionalesEstatus = "aprobado"
      } else {
        this.toast.error("Error inesperado!");
      }
    });
  }
}

comentarioAdicional(evaluacion){
  let fecha = new Date(); //Fecha actual
  let mes = fecha.getMonth()+1; //obteniendo mes
  let dia = fecha.getDate(); //obteniendo dia
  let ano = fecha.getFullYear(); //obteniendo año
  
 let fechaTotal= dia+'-'+mes+'-'+ano

  this.formAdicionales.controls['id'].setValue(evaluacion.id);
  this.formAdicionales.controls['fecha'].setValue(fechaTotal);
  this.formAdicionales.controls['usuario'].setValue(this.usuarioComentario);
  this.formAdicionales.controls['adicionales'].setValue('aprobado');
  this.formAdicionales.controls['estatus'].setValue('verificacion de identidad');
  if (this.formAdicionales.valid) {

    this.EvaluacionService.comentarioAdicionales(this.formAdicionales.value).subscribe(response => {
      if (response) {
        this.toast.success("Comentario guardado con exito!");
        this.comentariosAdicional()
      } else {
        this.toast.error("Error inesperado!");
      }
    });
  }
}

rechazarAdicionales(evaluacion){
  this.formAdicionales.controls['id'].setValue(evaluacion.id);
  this.formAdicionales.controls['adicionales'].setValue('rechazado');
  this.formAdicionales.controls['estatus'].setValue('negado archivos adicionales');
  if (this.formAdicionales.valid) {

    this.EvaluacionService.updateAdicionales(this.formAdicionales.value).subscribe(response => {
      if (response) {
        this.toast.error("Rechazado exitosamente!");
        this.adicionalesEstatus="rechazado"
      } else {
        this.toast.error("Error inesperado!");
      }
    });
  }
}


aceptarLlamada(evaluacion){
  this.formLlamada.controls['id'].setValue(evaluacion.id);
  this.formLlamada.controls['llamada'].setValue('aprobado');
  this.formLlamada.controls['estatus'].setValue('Aprobado');
  if (this.formLlamada.valid) {

    this.EvaluacionService.updateLlamada(this.formLlamada.value).subscribe(response => {
      if (response) {
        this.toast.success("Aprobado exito!");
        
      } else {
        this.toast.error("Error inesperado!");
      }
    });
  }
}

comentarioLlamada(evaluacion){
  let fecha = new Date(); //Fecha actual
  let mes = fecha.getMonth()+1; //obteniendo mes
  let dia = fecha.getDate(); //obteniendo dia
  let ano = fecha.getFullYear(); //obteniendo año
  
 let fechaTotal= dia+'-'+mes+'-'+ano

  this.formLlamada.controls['id'].setValue(evaluacion.id);
  this.formLlamada.controls['fecha'].setValue(fechaTotal);
  this.formLlamada.controls['usuario'].setValue(this.usuarioComentario);
  this.formLlamada.controls['llamada'].setValue('aprobado');
  this.formLlamada.controls['estatus'].setValue('verificacion de identidad');
  if (this.formLlamada.valid) {

    this.EvaluacionService.comentarioLlamada(this.formLlamada.value).subscribe(response => {
      if (response) {
        this.toast.success("Comentario guardado con exito!");
        
      } else {
        this.toast.error("Error inesperado!");
      }
    });
  }
}

rechazarLlamada(evaluacion){
  this.formLlamada.controls['id'].setValue(evaluacion.id);
  this.formLlamada.controls['llamada'].setValue('rechazado');
  this.formLlamada.controls['estatus'].setValue('negado en la llamada');
  if (this.formLlamada.valid) {

    this.EvaluacionService.updateLlamada(this.formLlamada.value).subscribe(response => {
      if (response) {
        this.toast.error("Rechazado exitosamente!");
        
      } else {
        this.toast.error("Error inesperado!");
      }
    });
  }
}

open(content) {
  this.modalService.open(content, { size: 'lg' }).result.then((result) => {
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

comentariosSelfie(){

  this.ComentariosService.getEvaluacion({evaluacionFk:this.activatedRoute.snapshot.params.id,tab:'selfie'}).subscribe(response => {
    console.log("obtener los comentos",response)
    this.comentSelfie=JSON.parse(JSON.stringify(response)).data;

    console.log('veamos',this.comentSelfie)
      // this.basicas=JSON.parse(JSON.stringify(response)).basica;
  
  });
}

comentariosIdentidad(){

  this.ComentariosService.getEvaluacion({evaluacionFk:this.activatedRoute.snapshot.params.id,tab:'identidad'}).subscribe(response => {
    console.log("obtener los comentos identidad",response)
    this.comentIdentidad=JSON.parse(JSON.stringify(response)).data;

    console.log('veamos',this.comentIdentidad)
      // this.basicas=JSON.parse(JSON.stringify(response)).basica;
  
  });
}

comentariosAdicional(){

  this.ComentariosService.getEvaluacion({evaluacionFk:this.activatedRoute.snapshot.params.id,tab:'adicional'}).subscribe(response => {
    console.log("obtener los comentos adicional",response)
    this.comentAdicional=JSON.parse(JSON.stringify(response)).data;

    console.log('veamos',this.comentAdicional)
      // this.basicas=JSON.parse(JSON.stringify(response)).basica;
  
  });
}

comentariosLlamada(){

  this.ComentariosService.getEvaluacion({evaluacionFk:this.activatedRoute.snapshot.params.id,tab:'llamada'}).subscribe(response => {
    console.log("obtener los comentos llamada",response)
    this.comentLlamada=JSON.parse(JSON.stringify(response)).data;

    console.log('veamos',this.comentLlamada)
      // this.basicas=JSON.parse(JSON.stringify(response)).basica;
  
  });
}

comentariosDC(){

  this.ComentariosService.getEvaluacion({evaluacionFk:this.activatedRoute.snapshot.params.id,tab:'dataCredito'}).subscribe(response => {
    console.log("obtener los comentos data credito",response)
    this.comentDC=JSON.parse(JSON.stringify(response)).data;

    console.log('veamos',this.comentDC)
      // this.basicas=JSON.parse(JSON.stringify(response)).basica;
  
  });
}

comentariosEB(){

  this.ComentariosService.getEvaluacion({evaluacionFk:this.activatedRoute.snapshot.params.id,tab:'extractosBancarios'}).subscribe(response => {
    console.log("obtener los comentos data credito",response)
    this.comentEB=JSON.parse(JSON.stringify(response)).data;

    console.log('veamos',this.comentEB)
      // this.basicas=JSON.parse(JSON.stringify(response)).basica;
  
  });
}


borrarComentario(configuracion: any) {
  const confirm = swal.fire({
    title: `Borrar el comentario`,
    text: 'Esta acción no se puede deshacer',
    type: 'question',
    showConfirmButton: true,
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Borrar',
    focusCancel: true
  });

  from(confirm).subscribe(r => {
    if (r['value']) {
      this.ComentariosService.delete(configuracion.id).subscribe(response => {
        if (response) {
          this.toast.success("Dato eliminado con exito!");
          this.comentariosSelfie()
        } else {
          this.toast.error("Error inesperado!");
        }
      });
    }
  });
}

firmarDoc(idSolicitud) {
  const confirm = swal.fire({
    title: `Firmar el contrato`,
    text: '¿Estas seguro de firmar el contrato?',
    type: 'question',
    showConfirmButton: true,
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Aceptar',
    focusCancel: true,
    customClass: {
      icon: 'icon-class-yellow',
      confirmButton: 'confirm-button-class',
      cancelButton: 'cancel-button-class'
    }
  });

  from(confirm).subscribe(r => {
    if (r['value']) {

      this.EvaluacionService.generarteFile(idSolicitud).subscribe((res)=>{
        if (res) {
          this.toast.success("Contrato enviado con exito!");
        }
      },(error)=>{
        console.log(error);
      })
    }
  });
}

enviarCO(tipo,idSolicitud,tipoCredito) {
  const confirm = swal.fire({
    title: `Contra oferta`,
    text: '¿Estas seguro de enviar la contra oferta?',
    type: 'question',
    showConfirmButton: true,
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Aceptar',
    focusCancel: true,
    customClass: {
      icon: 'icon-class-yellow',
      confirmButton: 'confirm-button-class',
      cancelButton: 'cancel-button-class'
    }
  });

  from(confirm).subscribe(r => {
    if (r['value']) {
      let data = {
        "idSolicitud":idSolicitud,
        "tipo": tipoCredito == "m" ? 1 : 2,
        "tipo_monto":tipo
      }
      this.EvaluacionService.crearContraOferta(data).subscribe((res)=>{
        if (res) {
          this.toast.success("Contra oferta enviada con exito!");
        }
      },(error)=>{
        console.log(error);
      })
    }
  });
}
async calcularIngresoActividad(){

  // this.configIngreso$.subscribe(async (val)=>{
    
  //   if(val['data'] && ['data'].length>0){
      let totalIngreso = this.financieras ? this.financieras.ingresoTotalMensual : 0;

      if (Number.isNaN(totalIngreso)) {
        totalIngreso = 0;
      }
      this.ingreso_formulario = formatCurrency(totalIngreso, 'en-US', getCurrencySymbol('USD', 'wide'));
      this.calculoIngreso = JSON.parse(this.calculoIngresoAnalisis)
      console.log("ingreso=> ", this.calculoIngreso);
  //     await val['data'].forEach(element => {
  //       if(element.id == 1){
  //         this.calculoIngreso.alojamiento.total = (totalIngreso*element.puntaje)/100;
  //         this.calculoIngreso.alojamiento.porcentaje = parseFloat(element.puntaje);
  //         this.calculoIngreso.total.total += this.calculoIngreso.alojamiento.total;
  //         this.calculoIngreso.total.porcentaje +=this.calculoIngreso.alojamiento.porcentaje;
  //       }
  //       if(element.id == 2){
  //         this.calculoIngreso.alimentos.total = (totalIngreso*element.puntaje)/100;
  //         this.calculoIngreso.alimentos.porcentaje = parseFloat(element.puntaje);
  //         this.calculoIngreso.total.total += this.calculoIngreso.alimentos.total;
  //         this.calculoIngreso.total.porcentaje +=this.calculoIngreso.alimentos.porcentaje;
  //       }
  //       if(element.id == 3){
  //         this.calculoIngreso.servicios_publicos.total = (totalIngreso*element.puntaje)/100;
  //         this.calculoIngreso.servicios_publicos.porcentaje = parseFloat(element.puntaje);
  //         this.calculoIngreso.total.total += this.calculoIngreso.servicios_publicos.total;
  //         this.calculoIngreso.total.porcentaje +=this.calculoIngreso.servicios_publicos.porcentaje;
  //       }
  //       if(element.id == 4){
  //         this.calculoIngreso.transporte.total = (totalIngreso*element.puntaje)/100;
  //         this.calculoIngreso.transporte.porcentaje = parseFloat(element.puntaje);
  //         this.calculoIngreso.total.total += this.calculoIngreso.transporte.total;
  //         this.calculoIngreso.total.porcentaje +=this.calculoIngreso.transporte.porcentaje;
  //       }
  //       if(element.id == 5){
  //         this.calculoIngreso.vestido.total = (totalIngreso*element.puntaje)/100;
  //         this.calculoIngreso.vestido.porcentaje = parseFloat(element.puntaje);
  //         this.calculoIngreso.total.total += this.calculoIngreso.vestido.total;
  //         this.calculoIngreso.total.porcentaje +=this.calculoIngreso.vestido.porcentaje;
  //       }
  //       if(element.id == 6){
  //         this.calculoIngreso.recreacion.total = (totalIngreso*element.puntaje)/100;
  //         this.calculoIngreso.recreacion.porcentaje = parseFloat(element.puntaje);
  //         this.calculoIngreso.total.total += this.calculoIngreso.recreacion.total;
  //         this.calculoIngreso.total.porcentaje +=this.calculoIngreso.recreacion.porcentaje;
  //       }
  //       if(element.id == 7){
  //         this.calculoIngreso.muebles.total = (totalIngreso*element.puntaje)/100;
  //         this.calculoIngreso.muebles.porcentaje = parseFloat(element.puntaje);
  //         this.calculoIngreso.total.total += this.calculoIngreso.muebles.total;
  //         this.calculoIngreso.total.porcentaje +=this.calculoIngreso.muebles.porcentaje;
  //       }
  //       if(element.id == 8){
  //         this.calculoIngreso.bebidas_alcoholicas.total = (totalIngreso*element.puntaje)/100;
  //         this.calculoIngreso.bebidas_alcoholicas.porcentaje = parseFloat(element.puntaje);
  //         this.calculoIngreso.total.total += this.calculoIngreso.bebidas_alcoholicas.total;
  //         this.calculoIngreso.total.porcentaje +=this.calculoIngreso.bebidas_alcoholicas.porcentaje;
  //       }
  //       if(element.id == 9){
  //         this.calculoIngreso.salud.total = (totalIngreso*element.puntaje)/100;
  //         this.calculoIngreso.salud.porcentaje = parseFloat(element.puntaje);
  //         this.calculoIngreso.total.total += this.calculoIngreso.salud.total;
  //         this.calculoIngreso.total.porcentaje +=this.calculoIngreso.salud.porcentaje;
  //       }
  //       if(element.id == 10){
  //         this.calculoIngreso.promedio_composicion_hogar = parseInt(element.puntaje);
  //       }
  //       if(element.id == 11){
  //         this.calculoIngreso.aporte_hogar = element.puntaje;
  //       }
  //     });
  //     console.log("calculo=> ", this.calculoIngreso);
  //   }
  //   // let aloj = totalIngreso
  // })
}
estratoAlojamiento(){
  if(this.basicas){
  let ciud = this.basicas.ciudad;
  let cd = ciud.split('-');
  console.log(cd);
  let data = {
    estrato: this.basicas.estrato,
    alojamiento: cd[0]
  }
  this.EvaluacionService.getEstratoAlojamiento(data).subscribe((response)=>{
    this.totalRenta = JSON.parse(JSON.stringify(response)).monto
    this.calcularEgresoMonetario();
    console.log("TR",this.totalRenta)
  },(error)=>{
    console.log(error)
  })
}
}
  async calcularEgresoMonetario(){
    this.gastoMonetario = JSON.parse(this.gastoMonetarioAnalisis);
  // let np = this.nroPersonasDependenEconomicamente+1;
  // let totalIngreso = this.financieras ? this.financieras.ingresoTotalMensual : 0;
  //Renta
  // if(this.basicas.tipoVivienda == "Rentada"){
  //   console.log("entre renta")
  //   this.gastoMonetario.renta = (this.totalRenta*100)/100;
  // }else if(this.basicas.tipoVivienda =="Propia"){
  //   this.gastoMonetario.renta = (this.totalRenta*40)/100;
  // }else if(this.basicas.tipoVivienda =="Familiar"){
  //   this.gastoMonetario.renta = (this.totalRenta*20)/100;
  // }else if(this.basicas.tipoVivienda =="Hipotecada"){
  //   this.gastoMonetario.renta = (this.totalRenta*120)/100;
  // }
  //Alimentacion
  // this.gastoMonetario.alimentacion.per_capita = (this.calculoIngreso.alimentos.total/this.calculoIngreso.promedio_composicion_hogar);
  // this.gastoMonetario.alimentacion.total = (np*this.gastoMonetario.alimentacion.per_capita)

  //Servicios
  // if(this.basicas.estrato == 1){
  //   this.gastoMonetario.servicios.per_capita = (this.calculoIngreso.servicios_publicos.total*0.6)/1.5;
  // }else if(this.basicas.estrato == 2){
  //   this.gastoMonetario.servicios.per_capita = (this.calculoIngreso.servicios_publicos.total*0.6)/1.5;
  // }else if(this.basicas.estrato == 3){
  //   this.gastoMonetario.servicios.per_capita = (this.calculoIngreso.servicios_publicos.total*0.8)/1.5;
  // }else if(this.basicas.estrato == 4){
  //   this.gastoMonetario.servicios.per_capita = (this.calculoIngreso.servicios_publicos.total*1)/1.5;
  // }else if(this.basicas.estrato == 5){
  //   this.gastoMonetario.servicios.per_capita = (this.calculoIngreso.servicios_publicos.total*1.2)/1.5;
  // }else if(this.basicas.estrato == 6){
  //   this.gastoMonetario.servicios.per_capita = (this.calculoIngreso.servicios_publicos.total*1.5)/1.5;
  // }

  // this.gastoMonetario.servicios.total = (np*this.gastoMonetario.servicios.per_capita);

  //Transporte
  // this.gastoMonetario.transporte.per_capita = this.calculoIngreso.transporte.total;
  // this.gastoMonetario.transporte.total = this.gastoMonetario.transporte.per_capita*1.5;

  //Vestido
  // this.gastoMonetario.vestido.per_capita = (this.calculoIngreso.vestido.total/this.calculoIngreso.promedio_composicion_hogar)
  // this.gastoMonetario.vestido.total = (np*this.gastoMonetario.vestido.per_capita)

  //Cotizacion a salud
  // this.gastoMonetario.cotizacion_salud = (totalIngreso*0.08);

  //Total egresos
  // this.gastoMonetario.totalEgresos = this.gastoMonetario.renta+this.gastoMonetario.alimentacion.total+this.gastoMonetario.servicios.total+this.gastoMonetario.transporte.total+this.gastoMonetario.vestido.total+this.gastoMonetario.cotizacion_salud;

  //Total Egresos con Personas Activas Economicamente
  // if(this.personasaCargo>0){
  //   this.gastoMonetario.totalEgresosPAE = Math.round(this.gastoMonetario.totalEgresos-(((this.gastoMonetario.totalEgresos*this.calculoIngreso.aporte_hogar)/100)*this.personasaCargo));
  // }else{
  //   this.gastoMonetario.totalEgresosPAE = this.gastoMonetario.totalEgresos;
  // }
  // let todalDeudas = this.financieras.pagandoActual && this.financieras.pagandoActual !=" " ? parseInt(this.financieras.pagandoActual) : 0;
  if(this.gastoMonetario.totalEgresosPAE > this.financieras.egresoTotalMensual){
    // this.gastoMonetario.totalDisponible = totalIngreso-this.gastoMonetario.totalEgresosPAE-todalDeudas;
    // this.gastoMonetario.diponibleEndeudamiento = (this.gastoMonetario.totalDisponible*70)/100;
    this.total_gastos_familiares(this.gastoMonetario.totalEgresosPAE.toString());
  }else{
    this.total_gastos_familiares(this.financieras.egresoTotalMensual.toString());
    // this.gastoMonetario.totalDisponible = totalIngreso-this.financieras.egresoTotalMensual-todalDeudas;
    // this.gastoMonetario.diponibleEndeudamiento = (this.gastoMonetario.totalDisponible*70)/100;
  }

  //balance caja
  // await this.obtenerMonto(this.configCOMeses.monto_maximo, 12, 1);
  // await this.obtenerMonto(this.configCOMeses.monto_minimo, 12, 0);
  // await this.obtenerMonto2(this.configCODias.monto_maximo, 15, 1);
  // await this.obtenerMonto2(this.configCODias.monto_minimo, 15, 0);
  // if(this.gastoMonetario.diponibleEndeudamiento >= this.totalDiasMin){
  //   this.gastoMonetario.balanceCajaDiasMinimo = 1;
  // }else{
  //   this.gastoMonetario.balanceCajaDiasMinimo = 0;
  // }

  // if(this.gastoMonetario.diponibleEndeudamiento >= this.totalDiasMax){
  //   this.gastoMonetario.balanceCajaDiasMaximo = 1;
  // }else{
  //   this.gastoMonetario.balanceCajaDiasMaximo = 0;
  // }

  // if(this.gastoMonetario.diponibleEndeudamiento >= this.cuotaMensualMin){
  //   this.gastoMonetario.balanceCajaMesesMinimo = 1;
  // }else{
  //   this.gastoMonetario.balanceCajaMesesMinimo = 0;
  // }

  // if(this.gastoMonetario.diponibleEndeudamiento >= this.cuotaMensualMax){
  //   this.gastoMonetario.balanceCajaMesesMaximo = 1;
  // }else{
  //   this.gastoMonetario.balanceCajaMesesMaximo = 0;
  // }

  if(this.gastoMonetario.balanceCajaMesesMaximo==1 || this.gastoMonetario.balanceCajaMesesMinimo==1 || this.gastoMonetario.balanceCajaDiasMaximo==1 || this.gastoMonetario.balanceCajaDiasMinimo==1){
    // this.aceptarBalance()
  }else{
    // this.rechazarBalance()
  }
  // this.guardarCalculos()
  console.log('Gasto=> ', this.gastoMonetario);

}
guardarCalculos(){
let data = {
  "id":this.idEvaluacion,
  "calculoIngreso":this.calculoIngreso,
  "gastoMonetario":this.gastoMonetario
}

    this.EvaluacionService.updateCalculos(data).subscribe(response => {
      if (response) {
        // this.revisionBalance="aprobado";
        // this.toast.success("Aprobado exito!");
      
      } else {
        // this.toast.error("Error inesperado!");
      }
    });
}
aceptarBalance(){
  this.formBalance.controls['id'].setValue(this.idEvaluacion);
  this.formBalance.controls['balance'].setValue('aprobado');
  this.formBalance.controls['estatus'].setValue('verificacion de selfie');
  if (this.formBalance.valid) {

    this.EvaluacionService.updateBalance(this.formBalance.value).subscribe(response => {
      if (response) {
        this.revisionBalance="aprobado";
        this.toast.success("Aprobado exito!");
      
      } else {
        this.toast.error("Error inesperado!");
      }
    });
  }
}
rechazarBalance(){
  this.formBalance.controls['id'].setValue(this.idEvaluacion);
  this.formBalance.controls['balance'].setValue('rechazado');
  this.formBalance.controls['estatus'].setValue('negado en matriz de calculo');
  if (this.formBalance.valid) {

    this.EvaluacionService.updateBalance(this.formBalance.value).subscribe(response => {
      if (response) {
        this.revisionBalance="rechazado";
        this.toast.error("Rechazado!");
      
      } else {
        this.toast.error("Error inesperado!");
      }
    });
  }
}

getCODias(){
  this.configService.getTipoContraOferta(2).subscribe((response)=>{
    this.configCODias = response;
    console.log("configDias",this.configCODias)
  },(error)=>{
    console.log(error)
  })
}

getCOMeses(){
  this.configService.getTipoContraOferta(1).subscribe((response)=>{
    this.configCOMeses = response;
    console.log("configMeses",this.configCOMeses)
  },(error)=>{
    console.log(error)
  })
}

configDias(){
  this.configService.getTipo(2).subscribe((res)=>{
    this.configCalDias = res;
    this.plazoDias = (this.configCalDias ? parseInt(this.configCalDias.dias_minimo) : 15);
    this.montoSolicitadoDias = (this.configCalDias ? parseInt(this.configCalDias.monto_minimo) : 175000);
    this.montoRestDias = (this.configCalDias ? parseInt(this.configCalDias.monto_restriccion) : 0);
    this.montoResTooltipDias = (this.configCalDias ? parseInt(this.configCalDias.monto_restriccion_tooltip) : 0);
    this.diasRestDias = (this.configCalDias ? parseInt(this.configCalDias.dias_restriccion) : 0);
    this.tasaDias = (this.configCalDias ? parseFloat(this.configCalDias.tasa) : 0);
    this.porExpressDias = (this.configCalDias ? parseFloat(this.configCalDias.porcentaje_express) : 0);
    this.porIvaDias = (this.configCalDias ? parseFloat(this.configCalDias.porcentaje_iva) : 0);
    this.porplataformaDias = (this.configCalDias ? parseFloat(this.configCalDias.porcentaje_plataforma) : 0);
    // this.obtenerMonto2();
    console.log("CalDias",this.configCalDias);
  },(error)=>{
    console.log(error)
  })
}
configMeses(){
  this.configService.getTipo(1).subscribe((res)=>{
    this.configCalMeses = res;
    this.plazoMeses = (this.configCalMeses ? parseInt(this.configCalMeses.dias_minimo) : 2);
    this.montoSolicitado = (this.configCalMeses ? parseInt(this.configCalMeses.monto_minimo) : 250000);
    this.montoRestMeses = (this.configCalMeses ? parseInt(this.configCalMeses.monto_restriccion) : 0);
    this.montoResTooltipMeses = (this.configCalMeses ? parseInt(this.configCalMeses.monto_restriccion_tooltip) : 0);
    this.diasRestMeses = (this.configCalMeses ? parseInt(this.configCalMeses.dias_restriccion) : 0);
    this.tasaMeses = (this.configCalMeses ? parseFloat(this.configCalMeses.tasa) : 0);
    this.porExpressMeses = (this.configCalMeses ? parseFloat(this.configCalMeses.porcentaje_express) : 0);
    this.porExpressDosMeses = (this.configCalMeses ? parseFloat(this.configCalMeses.porcentaje_express_dos) : 0);
    this.porExpressTresMeses = (this.configCalMeses ? parseFloat(this.configCalMeses.porcentaje_express_tres) : 0);
    this.porIvaMeses = (this.configCalMeses ? parseFloat(this.configCalMeses.porcentaje_iva) : 0);
    this.porplataformaMeses = (this.configCalMeses ? parseFloat(this.configCalMeses.porcentaje_plataforma) : 0);
    // this.obtenerMonto();
    console.log("CalMeses",res);
  },(error)=>{
    console.log(error)
  })
} 
obtenerMonto(montoS,cant_mensual, tipo){
  let porPlat = this.porplataformaMeses > 0 ? this.porplataformaMeses : 4;
  let porIva = this.porIvaMeses > 0 ? this.porIvaMeses : 19;
  let tasa = this.tasaMeses > 0 ? this.tasaMeses : 0.01916667;
  let porExpUno = this.porExpressMeses > 0 ? this.porExpressMeses : 30;
  let porExpDos = this.porExpressDosMeses > 0 ? this.porExpressDosMeses : 27.5;
  let porExpTres = this.porExpressTresMeses > 0 ? this.porExpressTresMeses : 25;

    this.plataforma=parseFloat(montoS)*(porPlat/100);

    // console.log('plataverga inicial',this.plataforma)
    let cuotas=cant_mensual;
    let monto=parseFloat(montoS);
    this.t_interes = monto *( (tasa * Math.pow(1 + tasa, cuotas)) / (Math.pow(1 + tasa, cuotas) - 1) );
  //  console.log('tasa',this.t_interes.toFixed());
    this.getAmortizacion(tasa,parseFloat(montoS),cant_mensual);
    

    if(parseFloat(montoS)<=1200000){
      console.log("entreeee  1",montoS)
      
      this.ap_express=parseFloat(montoS)*porExpUno/100;
      // this.iva=(parseFloat(this.plataforma)+parseFloat(this.ap_express))*19/100;
      this.plataforma=parseFloat(this.plataforma)*parseFloat(cant_mensual)
      this.iva=(parseFloat(this.plataforma)+parseFloat(this.ap_express))*porIva/100;
      this.total=parseFloat(this.subtotal)+parseFloat(this.plataforma)+parseFloat(this.ap_express)+parseFloat(this.iva)
      this.cuotaMensual=Math.round(parseFloat(this.total)/parseFloat(cant_mensual))
      console.log("entreeee  total",this.total )
      console.log("entreeee  cuotas",cant_mensual )
    }else
    if(montoS>1200000 && montoS<=1700000){
      console.log("entreeee  2")
      this.ap_express=parseFloat(montoS)*porExpDos/100;
      // this.iva=(parseFloat(this.plataforma)+parseFloat(this.ap_express))*19/100;

      this.plataforma=parseFloat(this.plataforma)*parseFloat(cant_mensual)
      this.iva=(parseFloat(this.plataforma)+parseFloat(this.ap_express))*porIva/100;
      this.total=parseFloat(this.subtotal)+parseFloat(this.plataforma)+parseFloat(this.ap_express)+parseFloat(this.iva)
      this.cuotaMensual=Math.round(parseFloat(this.total)/parseFloat(cant_mensual))        
     
    }else
    if(montoS>=1700001){
      console.log("entreeee  3")
      this.ap_express=parseFloat(montoS)*porExpTres/100;
      // this.iva=(parseFloat(this.plataforma)+parseFloat(this.ap_express))*19/100;
      this.plataforma=parseFloat(this.plataforma)*parseFloat(cant_mensual)
      let plata=parseFloat(this.plataforma)*parseFloat(cant_mensual);
      this.iva=(parseFloat(this.plataforma)+parseFloat(this.ap_express))*porIva/100;
      this.total=parseFloat(this.subtotal)+parseFloat(this.plataforma)+parseFloat(this.ap_express)+parseFloat(this.iva)
      this.cuotaMensual=Math.round(parseFloat(this.total)/parseFloat(cant_mensual))
    

    }

    if(tipo == 1){
      this.cuotaMensualMax = this.cuotaMensual;
      console.log("cuota Max=> ", this.cuotaMensualMax)
    }else{
      this.cuotaMensualMin = this.cuotaMensual;
      console.log("cuota Min=> ", this.cuotaMensualMin)
    }
   
}

getAmortizacion(tasa,montoS,cant_mensual) {
    var valor_de_cuota = this.t_interes;
    var saldo_al_capital = montoS;
    let interesos;
    let abono_al_capital:any;
    var items = new Array();
    let sum=0;
    let resta:any=1000;

    for (let i=0; i < cant_mensual; i++) {
        interesos = saldo_al_capital * tasa;
        abono_al_capital = valor_de_cuota - interesos;
        saldo_al_capital -= abono_al_capital;
        let numero = i + 1;
    
        interesos = interesos;
        abono_al_capital = abono_al_capital
        saldo_al_capital = saldo_al_capital

        let item = [numero, interesos, abono_al_capital, valor_de_cuota, saldo_al_capital.toFixed(2)];
        items.push(item);
        sum+=parseFloat(interesos);
    }
    console.log(items);
    console.log(Math.round(sum));
    this.taxInTotal=sum;
    this.subtotal=Math.round(parseFloat(montoS)+parseFloat(this.taxInTotal));

}
obtenerMonto2(montoSolicitadoDias,plazo, tipo){
  let porPlat = this.porplataformaDias > 0 ? this.porplataformaDias : 1000;
  let porIva = this.porIvaDias > 0 ? this.porIvaDias : 19;
  let tasa = this.tasaDias > 0 ? this.tasaDias : 14;
  let porExp = this.porExpressDias > 0 ? this.porExpressDias : 12.5;

  this.plazoDias=plazo;
  // this.montoSolicitadoDias=this.configCODias;
  let tasitaNueva=(Math.pow((1+(tasa/100)),(this.plazoDias/360))-1);
  this.t_interesDias=tasitaNueva*montoSolicitadoDias;

  // this.t_interesDias=(Math.round((parseFloat(this.montoSolicitadoDias)*parseFloat(this.plazoDias))*tasa/360))/100
  this.subtotalDias=parseFloat(montoSolicitadoDias)+parseFloat(this.t_interesDias);

  this.plataformaDias=porPlat*parseFloat(this.plazoDias);
  this.ap_expressDias=parseFloat(montoSolicitadoDias)*porExp/100
  this.ivaDias=(parseFloat(this.plataformaDias)+parseFloat(this.ap_expressDias))*porIva/100
  this.totalDias=parseFloat(this.subtotalDias)+parseFloat(this.plataformaDias)+parseFloat(this.ap_expressDias)+parseFloat(this.ivaDias)

  if(tipo==1){
    this.totalDiasMax = Math.round(this.totalDias)
    console.log("total Max=> ", this.totalDiasMax)
  }else{
    this.totalDiasMin = this.totalDias
    console.log("total Min=> ", Math.round(this.totalDias))
  }

}
requerirSelfie(idEvaluacion){
  console.log(this.idUser)
  // this.idUser
  let data = {
    idUsuario: this.idUser
  }
  this.EvaluacionService.enviarCorreoRequeridoSelfie(data).subscribe((res)=>{
    console.log(res);
    this.toast.success("Correo enviado con exito!");
    this.estaosSolicitudes(idEvaluacion,'esperando selfies nuevas');
  },(error)=>{
    this.toast.error("Error enviando correo");
    console.log(error);
  })
}

requerirAdicionales(){
  console.log(this.idUser)
  // this.idUser
  let data = {
    idUsuario: this.idUser
  }
  this.EvaluacionService.enviarCorreoRequeridoAdicionales(data).subscribe((res)=>{
    console.log(res);
    this.toast.success("Correo enviado con exito!");
  },(error)=>{
    this.toast.error("Error enviando correo");
    console.log(error);
  })
}
fechaAlerta(event){
  var fecha = event.year+'-'+event.month+'-'+event.day;
  console.log(event);
  this.formDataCreditoAlerta.controls['fecha'].setValue(Moment(fecha).format("YYYY-MM-DD"));
}

agregarAlerta(){
  if(this.formDataCreditoAlerta.valid){
    this.EvaluacionService.crearAlerta(this.formDataCreditoAlerta.value).subscribe((res)=>{
      console.log(res);
      this.EvaluacionService.alertasAll({page:1,per_page:5,id:this.idEvaluacion});
      this.formDataCreditoAlerta.reset();
      this.formDataCreditoAlerta.controls['idEvaluacion'].setValue(this.idEvaluacion)
      this.toast.success('Creada con exito');
    },(error)=>{
      console.log(error)
      this.toast.error('Error insertando');
    })
  }else{
    this.toast.error('Datos vacios');
  }
}

agregarEndeudamiento(){
  if(this.formDataCreditoEndeudamiento.valid){
    this.EvaluacionService.crearEndeudamiento(this.formDataCreditoEndeudamiento.value).subscribe((res)=>{
      console.log(res);
      this.formDataCreditoEndeudamiento.reset();
      this.EvaluacionService.endeudamientoAll({page:1,per_page:5,id:this.idEvaluacion});
      this.formDataCreditoEndeudamiento.controls['idEvaluacion'].setValue(this.idEvaluacion)
      this.toast.success('Creada con exito');
    },(error)=>{
      console.log(error)
      this.toast.error('Error insertando');
    })
  }else{
    this.toast.error('Datos Vacios');
  }
}

agregarPorSector(){
  if(this.formDataCreditoPorSector.valid){
    this.EvaluacionService.crearPorSector(this.formDataCreditoPorSector.value).subscribe((res)=>{
      console.log(res);
      this.EvaluacionService.porSectorAll({page:1,per_page:5,id:this.idEvaluacion});
      this.formDataCreditoPorSector.reset();
      this.formDataCreditoPorSector.controls['idEvaluacion'].setValue(this.idEvaluacion)
      this.toast.success('Creada con exito');
    },(error)=>{
      console.log(error)
      this.toast.error('Error insertando');
    })
  }else{
    this.toast.error("Datos Vacios");
  }
}
guardarDataCredito(){
  if(this.formDataCredito.valid){
    if(this.formDataCredito.get('id').value == 1){
      this.EvaluacionService.modificarDataCredito(this.formDataCredito.value).subscribe((res)=>{
        console.log(res);
        this.formDataCredito.controls['idEvaluacion'].setValue(this.idEvaluacion)
        this.toast.success('Guardado con exito');
      },(error)=>{
        console.log(error)
        this.toast.error('Error insertando');
      })
    }else{
      this.EvaluacionService.crearDataCredito(this.formDataCredito.value).subscribe((res)=>{
        console.log(res);
        this.formDataCredito.controls['idEvaluacion'].setValue(this.idEvaluacion)
        this.toast.success('Guardado con exito');
      },(error)=>{
        console.log(error)
        this.toast.error('Error insertando');
      })
    }
    
  }else{
    this.toast.error("Datos vacios");
  }
}
perPageA(itemsPerPage,page){
  this.pA = page;
  this.itemsPerPageA = itemsPerPage;
  let param={page:this.pA,per_page:this.itemsPerPageA,id:this.idEvaluacion};
  this.EvaluacionService.alertasAll(param);


}
perPageE(itemsPerPage,page){
  this.pE = page;
  this.itemsPerPageE = itemsPerPage;
  let param={page:this.pE,per_page:this.itemsPerPageE,id:this.idEvaluacion};
  this.EvaluacionService.getIngresoActividadAll(param);

}
perPageS(itemsPerPage,page){
  this.pS = page;
  this.itemsPerPageS = itemsPerPage;
  let param={page:this.pS,per_page:this.itemsPerPageS,id:this.idEvaluacion};
  this.EvaluacionService.getIngresoActividadAll([param]);

}
getDataCredito(){
  this.EvaluacionService.getDC(this.idEvaluacion).subscribe((res)=>{
    let data = JSON.parse(JSON.stringify(res));
    if(data && data.sintesis && data.analisisIngresos && data.indicadorPago){
      this.formDataCredito.controls['id'].setValue(1);
      this.formDataCredito.controls['estadoDocumento'].setValue(data.sintesis.estadoDocumento);
      if(data.sintesis.estadoDocumento == true){
        this.formDataCredito.controls['estadoDocumentoAp'].setValue(true);
        this.formDataCredito.controls['estadoDocumentoDe'].setValue(false);
      }else{
        this.formDataCredito.controls['estadoDocumentoAp'].setValue(false);
        this.formDataCredito.controls['estadoDocumentoDe'].setValue(true);
      }
      this.formDataCredito.controls['nroCedula'].setValue(data.sintesis.nroCedula);
      if(data.sintesis.nroCedula == true){
        this.formDataCredito.controls['nroCedulaAp'].setValue(true);
        this.formDataCredito.controls['nroCedulaDe'].setValue(false);
      }else{
        this.formDataCredito.controls['nroCedulaAp'].setValue(false);
        this.formDataCredito.controls['nroCedulaDe'].setValue(true);
      }
      this.formDataCredito.controls['fechaExpedicion'].setValue(data.sintesis.fechaExpedicion);
      if(data.sintesis.fechaExpedicion == true){
        this.formDataCredito.controls['fechaExpedicionAp'].setValue(true);
        this.formDataCredito.controls['fechaExpedicionDe'].setValue(false);
      }else{
        this.formDataCredito.controls['fechaExpedicionAp'].setValue(false);
        this.formDataCredito.controls['fechaExpedicionDe'].setValue(true);
      }
      this.formDataCredito.controls['genero'].setValue(data.sintesis.genero);
      if(data.sintesis.genero == true){
        this.formDataCredito.controls['generoAp'].setValue(true);
        this.formDataCredito.controls['generoDe'].setValue(false);
      }else{
        this.formDataCredito.controls['generoAp'].setValue(false);
        this.formDataCredito.controls['generoDe'].setValue(true);
      }
      this.formDataCredito.controls['rangoEdad'].setValue(data.sintesis.rangoEdad);
      if(data.sintesis.rangoEdad == true){
        this.formDataCredito.controls['rangoEdadAp'].setValue(true);
        this.formDataCredito.controls['rangoEdadDe'].setValue(false);
      }else{
        this.formDataCredito.controls['rangoEdadAp'].setValue(false);
        this.formDataCredito.controls['rangoEdadDe'].setValue(true);
      }
      this.formDataCredito.controls['situacionLaboral'].setValue(data.analisisIngresos.situacionLaboral);
      this.formDataCredito.controls['ingresoVsCuota'].setValue(data.analisisIngresos.ingresoVsCuota);
      this.formDataCredito.controls['ingresoEstimado'].setValue(data.analisisIngresos.ingresoEstimado);
      this.total_ingreso_estimado(data.analisisIngresos.ingresoEstimado);
      this.total_ingreso_vs_cuota(data.analisisIngresos.ingresoVsCuota);
      this.formDataCredito.controls['bajo'].setValue(data.indicadorPago.bajo);
      this.formDataCredito.controls['medio'].setValue(data.indicadorPago.medio);
      this.formDataCredito.controls['alto'].setValue(data.indicadorPago.alto);
      this.formDataCredito.controls['puntajeBajo'].setValue(data.indicadorPago.puntajeBajo);
      this.formDataCredito.controls['puntajeMedio'].setValue(data.indicadorPago.puntajeMedio);
      this.formDataCredito.controls['puntajeAlto'].setValue(data.indicadorPago.puntajeAlto);
    }
  },(error)=>{
    console.log(error)
  })
}

deleteAlerta(data){
  if(data){
    let params = {id:data.id}
    this.EvaluacionService.borrarAlerta(params).subscribe((res)=>{
      console.log(res);
      this.EvaluacionService.alertasAll({page:1,per_page:5,id:this.idEvaluacion});
      this.toast.success("Eliminado con exito");
    },(error)=>{
      console.log(error);
      this.toast.error("Error Eliminando");
    })
  }

}
deleteEndeudamiento(data){
  if(data){
    let params = {id:data.id}
    this.EvaluacionService.borrarEndeudamiento(params).subscribe((res)=>{
      console.log(res);
      this.EvaluacionService.endeudamientoAll({page:1,per_page:5,id:this.idEvaluacion});
      this.toast.success("Eliminado con exito");
    },(error)=>{
      console.log(error);
      this.toast.error("Error Eliminando");
    })
  }
}
deletePorSector(data){
  if(data){
    let params = {id:data.id}
    this.EvaluacionService.borrarPorSector(params).subscribe((res)=>{
      console.log(res);
      this.EvaluacionService.porSectorAll({page:1,per_page:5,id:this.idEvaluacion});
      this.toast.success("Eliminado con exito");
    },(error)=>{
      console.log(error);
      this.toast.error("Error Eliminando");
    })
  }
}
total_ingreso_estimado(value: string) {
  // ing_mensuales (ingreso formulario - ingreso data credito)/ingreso data credito *100%
  let totalIngreso = this.financieras ? this.financieras.ingresoTotalMensual : 0;
  this.formDataCredito.controls["ingresoEstimado"].setValue(value);
  let v =((parseInt(totalIngreso) - parseInt(value))/parseInt(value))*100;
  this.variacion_ingreso = v.toFixed(2);
console.log(value)
  let val = parseInt(value, 10);
  if (Number.isNaN(val)) {
    val = 0;
  }
  this.ingreso_estimado = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
}

total_ingreso_vs_cuota(value: string) {
  // ing_mensuales
  this.formDataCredito.controls["ingresoVsCuota"].setValue(value);
console.log(value)
  let val = parseInt(value, 10);
  if (Number.isNaN(val)) {
    val = 0;
  }
  this.ingreso_vs_cuota = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
}


total_cupo_inicial(value: string) {
  // ing_mensuales
  this.formDataCreditoPorSector.controls["cupoInicial"].setValue(value);
console.log(value)
  let val = parseInt(value, 10);
  if (Number.isNaN(val)) {
    val = 0;
  }
  this.cupo_inicial = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
}
total_saldo_actual(value: string) {
  // ing_mensuales
  this.formDataCreditoPorSector.controls["saldoActual"].setValue(value);
console.log(value)
  let val = parseInt(value, 10);
  if (Number.isNaN(val)) {
    val = 0;
  }
  this.saldo_actual = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
}
total_cuota_mensual(value: string) {
  // ing_mensuales
  this.formDataCreditoPorSector.controls["cuotaMensual"].setValue(value);
console.log(value)
  let val = parseInt(value, 10);
  if (Number.isNaN(val)) {
    val = 0;
  }
  this.cuota_mensual = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
}
total_gastos_familiares(value: string) {
  // ing_mensuales
  this.formDataCreditoPorSector.controls["gastosFamiliares"].setValue(value);
console.log(value)
  let val = parseInt(value, 10);
  if (Number.isNaN(val)) {
    val = 0;
  }
  this.gastos_familiares = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
}
total_ingreso_mensual(value: string) {
  // ing_mensuales
  this.formDataCreditoPorSector.controls["ingresoMensual"].setValue(value);
console.log(value)
  let val = parseInt(value, 10);
  if (Number.isNaN(val)) {
    val = 0;
  }
  this.ingreso_mensual = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
}
total_saldo_mora(value: string) {
  // ing_mensuales
  let im =  this.formDataCreditoPorSector.get('ingresoMensual').value;
  let cm =this.formDataCreditoPorSector.get('cuotaMensual').value
  let gf =this.formDataCreditoPorSector.get('gastosFamiliares').value
  let suma = parseInt(im)-(parseInt(cm)+parseInt(gf)+parseInt(value));
  this.total_disponible_mensual(suma.toString());
  this.formDataCreditoPorSector.controls["saldoMora"].setValue(value);
console.log(value)
  let val = parseInt(value, 10);
  if (Number.isNaN(val)) {
    val = 0;
  }
  this.saldo_mora = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
}
total_disponible_mensual(value: string) {
  // ing_mensuales
  let por = (parseInt(value)*70)/100;
  this.total_disponible_endeudamiento(por.toString());
  this.formDataCreditoPorSector.controls["disponibleMensual"].setValue(value);
console.log(value)
  let val = parseInt(value, 10);
  if (Number.isNaN(val)) {
    val = 0;
  }
  this.disponible_mensual = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
}
total_disponible_endeudamiento(value: string) {
  // ing_mensuales
  this.formDataCreditoPorSector.controls["disponibleEndeudamiento"].setValue(value);
console.log(value)
  let val = parseInt(value, 10);
  if (Number.isNaN(val)) {
    val = 0;
  }
  this.disponible_endeudamiento = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
}

estado_documento(opcion){

  if(opcion == "de"){
    this.formDataCredito.controls["estadoDocumento"].setValue(false);
    this.formDataCredito.controls["estadoDocumentoAp"].setValue(false);
    this.formDataCredito.controls["estadoDocumentoDe"].setValue(true);
  }else if(opcion == "ap"){
    this.formDataCredito.controls["estadoDocumento"].setValue(true);
    this.formDataCredito.controls["estadoDocumentoAp"].setValue(true);
    this.formDataCredito.controls["estadoDocumentoDe"].setValue(false);
  }
}
nro_cedula(opcion){

  if(opcion == "de"){
    this.formDataCredito.controls["nroCedula"].setValue(false);
    this.formDataCredito.controls["nroCedulaAp"].setValue(false);
    this.formDataCredito.controls["nroCedulaDe"].setValue(true);
  }else if(opcion == "ap"){
    this.formDataCredito.controls["nroCedula"].setValue(true);
    this.formDataCredito.controls["nroCedulaAp"].setValue(true);
    this.formDataCredito.controls["nroCedulaDe"].setValue(false);
  }
}
fecha_expedicion(opcion){

  if(opcion == "de"){
    this.formDataCredito.controls["fechaExpedicion"].setValue(false);
    this.formDataCredito.controls["fechaExpedicionAp"].setValue(false);
    this.formDataCredito.controls["fechaExpedicionDe"].setValue(true);
  }else if(opcion == "ap"){
    this.formDataCredito.controls["fechaExpedicion"].setValue(true);
    this.formDataCredito.controls["fechaExpedicionAp"].setValue(true);
    this.formDataCredito.controls["fechaExpedicionDe"].setValue(false);
  }
}
genero_(opcion){

  if(opcion == "de"){
    this.formDataCredito.controls["genero"].setValue(false);
    this.formDataCredito.controls["generoAp"].setValue(false);
    this.formDataCredito.controls["generoDe"].setValue(true);
  }else if(opcion == "ap"){
    this.formDataCredito.controls["genero"].setValue(true);
    this.formDataCredito.controls["generoAp"].setValue(true);
    this.formDataCredito.controls["generoDe"].setValue(false);
  }
}
rango_edad(opcion){

  if(opcion == "de"){
    this.formDataCredito.controls["rangoEdad"].setValue(false);
    this.formDataCredito.controls["rangoEdadAp"].setValue(false);
    this.formDataCredito.controls["rangoEdadDe"].setValue(true);
  }else if(opcion == "ap"){
    this.formDataCredito.controls["rangoEdad"].setValue(true);
    this.formDataCredito.controls["rangoEdadAp"].setValue(true);
    this.formDataCredito.controls["rangoEdadDe"].setValue(false);
  }
}

aceptarDc(evaluacion){
  this.formDc.controls['id'].setValue(evaluacion.id);
  this.formDc.controls['data_credito'].setValue('aprobado');
  this.formDc.controls['estatus'].setValue('aprobado');
  if (this.formDc.valid) {

    this.EvaluacionService.updateDc(this.formDc.value).subscribe(response => {
      if (response) {
        this.toast.success("Aprobado exito!");
        this.DataCreditoEstatus = 'aprobado'
      } else {
        this.toast.error("Error inesperado!");
      }
    });
  }
}


rechazarDc(evaluacion){
  this.formDc.controls['id'].setValue(evaluacion.id);
  this.formDc.controls['data_credito'].setValue('rechazado');
  this.formDc.controls['estatus'].setValue('negado en data credito');
  if (this.formDc.valid) {

    this.EvaluacionService.updateDc(this.formDc.value).subscribe(response => {
      if (response) {
        this.toast.error("Rechazado exitosamente!");
        this.DataCreditoEstatus = 'rechazado'
      } else {
        this.toast.error("Error inesperado!");
      }
    });
  }
}

requerirCertificado(id){
  console.log(this.idUser)
  // this.idUser
  let data = {
    idUsuario: this.idUser
  }
  this.EvaluacionService.enviarCorreoRequeridoCertificado(data).subscribe((res)=>{
    console.log(res);
    this.toast.success("Correo enviado con exito!");
    this.estaosSolicitudes(id,'esperando certificado bancario');
  },(error)=>{
    this.toast.error("Error enviando correo");
    console.log(error);
  })
}
requerirCertificadoLaboral(id){
  console.log(this.idUser)
  // this.idUser
  let data = {
    idUsuario: this.idUser
  }
  this.EvaluacionService.enviarCorreoRequeridoCertificadoLaboral(data).subscribe((res)=>{
    console.log(res);
    this.toast.success("Correo enviado con exito!");
    this.estaosSolicitudes(id,'esperando certificacion laboral');
  },(error)=>{
    this.toast.error("Error enviando correo");
    console.log(error);
  })
}
requerirDesprendible(id){
  console.log(this.idUser)
  // this.idUser
  let data = {
    idUsuario: this.idUser
  }
  this.EvaluacionService.enviarCorreoRequeridoDesprendible(data).subscribe((res)=>{
    console.log(res);
    this.toast.success("Correo enviado con exito!");
    this.estaosSolicitudes(id,'esperando desprendible de nomina');
  },(error)=>{
    this.toast.error("Error enviando correo");
    console.log(error);
  })
}
requerirExtracto(id){
  console.log(this.idUser)
  // this.idUser
  let data = {
    idUsuario: this.idUser
  }
  this.EvaluacionService.enviarCorreoRequeridoExtracto(data).subscribe((res)=>{
    console.log(res);
    this.toast.success("Correo enviado con exito!");
    this.estaosSolicitudes(id,'esperando extracto bancario');
  },(error)=>{
    this.toast.error("Error enviando correo");
    console.log(error);
  })
}
requerirVerificacion(id){
  console.log(this.idUser)
  // this.idUser
  let data = {
    idUsuario: this.idUser
  }
  this.EvaluacionService.enviarCorreoVerificacion(data).subscribe((res)=>{
    console.log(res);
    this.toast.success("Correo enviado con exito!");
    this.estaosSolicitudes(id,'esperando verificacion de reportado');
  },(error)=>{
    this.toast.error("Error enviando correo");
    console.log(error);
  })
}

estaosSolicitudes(idEvaluacion,estatus){
  // estatusSolicitudes

  let data={id:idEvaluacion,estatus:estatus}
  this.EvaluacionService.estatusSolicitudes(data).subscribe((res)=>{
    console.log(res);
    this.toast.success("Correo enviado con exito!");
   
  },(error)=>{
    this.toast.error("Error enviando correo");
    console.log(error);
  })
}
//funciones para extrato bancario
total_saldo_anterior_eb(value: string) {
  // ing_mensuales

  this.formExtractoBancario.controls["saldoAnterior"].setValue(value);
console.log(value)
  let val = parseInt(value, 10);
  if (Number.isNaN(val)) {
    val = 0;
  }
  this.saldo_anterior_eb = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));

  let sa=0
  let ab=0
  let c=0
  let res =0
  if(this.formExtractoBancario.get('saldoAnterior').value != ''){
    sa = parseInt(this.formExtractoBancario.get('saldoAnterior').value)
  }
  if(this.formExtractoBancario.get('totalAbonos').value != ''){
    ab = parseInt(this.formExtractoBancario.get('totalAbonos').value)
  }
  if(this.formExtractoBancario.get('totalCargos').value != ''){
    c = parseInt(this.formExtractoBancario.get('totalCargos').value)
  }
  res = (sa+ab)-c;
  console.log("REER",res)
  this.total_saldo_actual_eb(res.toString());
}

total_total_abonos_eb(value: string) {
  // ing_mensuales
  this.formExtractoBancario.controls["totalAbonos"].setValue(value);
console.log(value)
  let val = parseInt(value, 10);
  if (Number.isNaN(val)) {
    val = 0;
  }

  if(val>0){
    let r = val/3
    this.total_abonos_eb_3 = formatCurrency(r, 'en-US', getCurrencySymbol('USD', 'wide'));
  }
  this.total_abonos_eb = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
  let sa=0
  let ab=0
  let c=0
  let res =0
  if(this.formExtractoBancario.get('saldoAnterior').value != ''){
    sa = parseInt(this.formExtractoBancario.get('saldoAnterior').value)
  }
  if(this.formExtractoBancario.get('totalAbonos').value != ''){
    ab = parseInt(this.formExtractoBancario.get('totalAbonos').value)
  }
  if(this.formExtractoBancario.get('totalCargos').value != ''){
    c = this.formExtractoBancario.get('totalCargos').value
  }
  res = (sa+ab)-c;
  console.log("REER",res)
  this.total_saldo_actual_eb(res.toString());
}

total_total_cargos_eb(value: string) {
  // ing_mensuales
  this.formExtractoBancario.controls["totalCargos"].setValue(value);
console.log(value)
  let val = parseInt(value, 10);
  if (Number.isNaN(val)) {
    val = 0;
  }
  if(val>0){
    let r = val/3
    this.total_cargos_eb_3 = formatCurrency(r, 'en-US', getCurrencySymbol('USD', 'wide'));
  }
  this.total_cargos_eb = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
  let sa=0
  let ab=0
  let c=0
  let res =0
  if(this.formExtractoBancario.get('saldoAnterior').value != ''){
    sa = parseInt(this.formExtractoBancario.get('saldoAnterior').value)
  }
  if(this.formExtractoBancario.get('totalAbonos').value != ''){
    ab = parseInt(this.formExtractoBancario.get('totalAbonos').value)
  }
  if(this.formExtractoBancario.get('totalCargos').value != ''){
    c = parseInt(this.formExtractoBancario.get('totalCargos').value)
  }
  res = (sa+ab)-c;
  console.log("REER",res)
  this.total_saldo_actual_eb(res.toString());
}
total_saldo_actual_eb(value: string) {
  // ing_mensuales
  this.formExtractoBancario.controls["saldoActual"].setValue(value);
console.log(value)
  let val = parseInt(value, 10);
  if (Number.isNaN(val)) {
    val = 0;
  }
  this.saldo_actual_eb = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
}
total_saldo_promedio_eb(value: string) {
  // ing_mensuales
  this.formExtractoBancario.controls["saldoPromedio"].setValue(value);
console.log(value)
  let val = parseInt(value, 10);
  if (Number.isNaN(val)) {
    val = 0;
  }
  this.saldo_promedio_eb = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
}
total_salario_eb(value: string) {
  // ing_mensuales
  this.formExtractoBancario.controls["salario"].setValue(value);
console.log(value)
  let val = parseInt(value, 10);
  if (Number.isNaN(val)) {
    val = 0;
  }
  this.salario_eb = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
}
total_valor_total_mensual_creditos_actuales_eb(value: string) {
  // ing_mensuales
  this.formExtractoBancario.controls["valorTotalMensualCreditosActuales"].setValue(value.trim());
console.log("VVVTTT",value)
  let val = parseInt(value, 10);
  if (Number.isNaN(val)) {
    val = 0;
    this.formExtractoBancario.controls["valorTotalMensualCreditosActuales"].setValue(0);
  }
  this.valor_total_mensual_creditos_actuales_eb = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
}
fechaEbp(event){
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
  
  this.formExtractoBancarioPagos.controls['fecha'].setValue(fecha);
  console.log(this.formExtractoBancarioPagos.value);
}
total_valor_ingresos_ebp(value: string) {
  // ing_mensuales
  this.formExtractoBancarioPagos.controls["valorIngreso"].setValue(value);
console.log(value)
  let val = parseInt(value, 10);
  if (Number.isNaN(val)) {
    val = 0;
  }
  this.valor_ingresos_ebp = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
}
total_total_mensual_ebp(value: string) {
  // ing_mensuales
  this.formExtractoBancarioPagos.controls["totalMensual"].setValue(value);
console.log(value)
  let val = parseInt(value, 10);
  if (Number.isNaN(val)) {
    val = 0;
  }
  this.total_mensual_ebp = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
}
total_promedio_ebp(value: string) {
  // ing_mensuales
  this.formExtractoBancarioPagos.controls["promedio"].setValue(value);
console.log(value)
  let val = parseInt(value, 10);
  if (Number.isNaN(val)) {
    val = 0;
  }
  this.promedio_ebp = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
}
fechaEbc(event){
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
  console.log(event);
  this.formExtractoBancarioCreditos.controls['fecha'].setValue(fecha);
}
total_ingresos_ebc(value: string) {
  // ing_mensuales
  this.formExtractoBancarioCreditos.controls["ingresoPrestamo"].setValue(value);
console.log(value)
  let val = parseInt(value, 10);
  if (Number.isNaN(val)) {
    val = 0;
  }
  this.ingresos_ebc = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
}
total_cuota_credito_ebc(value: string) {
  // ing_mensuales
  this.formExtractoBancarioCreditos.controls["cuotaCredito"].setValue(value);
console.log(value)
  let val = parseInt(value, 10);
  if (Number.isNaN(val)) {
    val = 0;
  }
  this.cuota_credito_ebc = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
}
guardarEB(){
  if(this.formExtractoBancario.valid){

      this.EvaluacionService.guardarEB(this.formExtractoBancario.value).subscribe((res)=>{
        console.log(res);
        this.formExtractoBancario.controls['idEvaluacion'].setValue(this.idEvaluacion)
        this.formExtractoBancario.controls['id'].setValue(JSON.parse(JSON.stringify(res)).id)
        this.toast.success('Guardado con exito');

      },(error)=>{
        console.log(error)
        this.toast.error('Error insertando');
      });
    
  }else{
    this.toast.error("Datos vacios");
  }
}
guardarEBP(){
  if(this.formExtractoBancarioPagos.valid){

      this.EvaluacionService.guardarEBP(this.formExtractoBancarioPagos.value).subscribe((res)=>{
        console.log(res);

        this.formExtractoBancarioPagos.reset();
        this.formExtractoBancarioPagos.controls['idEvaluacion'].setValue(this.idEvaluacion)
        this.formExtractoBancarioPagos.controls['totalMensual'].setValue(0)
        this.formExtractoBancarioPagos.controls['promedio'].setValue(0)
        this.getEBP();
        this.toast.success('Guardado con exito');
      },(error)=>{
        console.log(error)
        this.toast.error('Error insertando');
      });
    
  }else{
    this.toast.error("Datos vacios");
  }
}
guardarEBC(){
  if(this.formExtractoBancarioCreditos.valid){

      this.EvaluacionService.guardarEBC(this.formExtractoBancarioCreditos.value).subscribe((res)=>{
        console.log(res);
        
        this.formExtractoBancarioCreditos.reset();
        this.formExtractoBancarioCreditos.controls['idEvaluacion'].setValue(this.idEvaluacion)
        this.toast.success('Guardado con exito');
        this.getEBC();
      },(error)=>{
        console.log(error)
        this.toast.error('Error insertando');
      });
    
  }else{
    this.toast.error("Datos vacios");
  }
}
getEB(){
  this.EvaluacionService.obtenerEB({id:this.idEvaluacion}).subscribe((res)=>{
    console.log("asas",res);
    if(res){
      this.extractos_bancarios = JSON.parse(JSON.stringify(res)).extractosBancarios
      if(this.extractos_bancarios){
       this.formExtractoBancario.controls['id'].setValue(this.extractos_bancarios.id);
      this.formExtractoBancario.controls['tipoContrato'].setValue(this.extractos_bancarios.tipoContrato);
      if(this.extractos_bancarios.tipoPagoNomina){
        this.tipoPagoNomina = this.extractos_bancarios.tipoPagoNomina;
        this.getEBP();
      }
      this.total_saldo_anterior_eb(this.extractos_bancarios.saldoAnterior.toString());
      this.total_total_abonos_eb(this.extractos_bancarios.totalAbonos.toString());
      this.total_total_cargos_eb(this.extractos_bancarios.totalCargos.toString());
      this.total_saldo_promedio_eb(this.extractos_bancarios.saldoPromedio.toString()); 
      }
      
    }
  },(error)=>{
    console.log(error)
    // this.toast.error('Error insertando');
  });
}
getEBP(){
  this.EvaluacionService.obtenerEBP({id:this.idEvaluacion}).subscribe((res)=>{
    console.log(res);
    this.extractos_bancarios_pagos_promedio =0;
    this.extractos_bancarios_pagos = JSON.parse(JSON.stringify(res)).extractosBancariosPagos
    let s = 0;
    let c = 1;
    let t = 0
    let pr =0;
    let ss=0
    this.extractos_bancarios_pagos.forEach((element,index) => {
      if(this.tipoPagoNomina == 'Quincenal'){
        t= this.extractos_bancarios_pagos.length/2;
        if(c==2){
        s= s+parseInt(element.valorIngreso);
        this.extractos_bancarios_pagos[index]['totalMensualF'] = s;
        ss=ss+s;
        c=0;
        s=0;
        }else{
          this.extractos_bancarios_pagos[index]['totalMensualF'] = 0;
          s= s+parseInt(element.valorIngreso);
          
        }
      }else{
        t= this.extractos_bancarios_pagos.length
        this.extractos_bancarios_pagos[index]['totalMensualF'] = parseInt(element.valorIngreso);
        ss=ss+parseInt(element.valorIngreso);
      }
      
      console.log('extractos_bancarios_pagos_promedio',ss,t);
      c=c+1;
      

    });
    if(t>1){
      this.extractos_bancarios_pagos_promedio = ss/t;
    }else{
      this.extractos_bancarios_pagos_promedio = ss
    }
    
    console.log('extractos_bancarios_pagos_promedio_tt',  this.extractos_bancarios_pagos_promedio);
  },(error)=>{
    console.log(error)
    // this.toast.error('Error insertando');
  });
}
getEBC(){
  this.extractos_bancarios_creditos_ingreso_credito=0
  this.extractos_bancarios_creditos_cuota_credito=0
  this.extractos_bancarios_creditos_resta_total=0
  this.EvaluacionService.obtenerEBC({id:this.idEvaluacion}).subscribe((res)=>{
    console.log(res);
    this.extractos_bancarios_creditos = JSON.parse(JSON.stringify(res)).extractosBancariosCreditos
    this.extractos_bancarios_creditos.forEach(element => {
      this.extractos_bancarios_creditos_ingreso_credito = this.extractos_bancarios_creditos_ingreso_credito+parseInt(element.ingresoPrestamo)
      this.extractos_bancarios_creditos_cuota_credito = this.extractos_bancarios_creditos_cuota_credito+parseInt(element.cuotaCredito)
      
    });
    this.extractos_bancarios_creditos_resta_total = this.extractos_bancarios_creditos_cuota_credito-this.extractos_bancarios_creditos_ingreso_credito
  },(error)=>{
    console.log(error)
    // this.toast.error('Error insertando');
  });
}
deleteEBP(data){
  if(data){
    let params = {id:data.id}
    this.EvaluacionService.borrarEBP(params).subscribe((res)=>{
      console.log(res);
      this.getEBP();
      this.toast.success("Eliminado con exito");
    },(error)=>{
      console.log(error);
      this.toast.error("Error Eliminando");
    })
  }

}
deleteEBC(data){
  if(data){
    let params = {id:data.id}
    this.EvaluacionService.borrarEBC(params).subscribe((res)=>{
      console.log(res);
      this.getEBC();
      this.toast.success("Eliminado con exito");
    },(error)=>{
      console.log(error);
      this.toast.error("Error Eliminando");
    })
  }

}
aceptarEb(evaluacion){
  this.formEb.controls['id'].setValue(evaluacion.id);
  this.formEb.controls['extracto_bancario'].setValue('aprobado');
  this.formEb.controls['estatus'].setValue('Esperando revision data credito');
  if (this.formEb.valid) {

    this.EvaluacionService.updateEb(this.formEb.value).subscribe(response => {
      if (response) {
        this.toast.success("Aprobado exito!");
        this.ExtratosBancarios = 'aprobado'
      } else {
        this.toast.error("Error inesperado!");
      }
    });
  }
}


rechazarEb(evaluacion){
  this.formEb.controls['id'].setValue(evaluacion.id);
  this.formEb.controls['extracto_bancario'].setValue('rechazado');
  this.formEb.controls['estatus'].setValue('negado en extractos bancarios');
  if (this.formEb.valid) {

    this.EvaluacionService.updateEb(this.formEb.value).subscribe(response => {
      if (response) {
        this.toast.error("Rechazado exitosamente!");
        this.ExtratosBancarios = 'rechazado'
      } else {
        this.toast.error("Error inesperado!");
      }
    });
  }
}
tipoPagoEB(value){
  
this.tipoPagoNomina = value
let id = this.formExtractoBancario.get('id').value
console.log("tipoPago",id)
if(id){
  let data  = {
    tipoPagoNomina: value,
    id:id
  }
  this.EvaluacionService.updateEbTipoPagoNomina(data).subscribe((res)=>{
    // this.getEB();
    console.log(res);
  },(error)=>{
    console.log(error)
  })
}
this.getEBP();
  // console.log(data)
}
closeExternal(){
  this.closeExternalId.emit(false);
}

openApprove(modal){
  this.openExternalModal.emit([modal, this.user]);
}
}
