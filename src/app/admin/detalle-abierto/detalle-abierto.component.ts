import { Component, OnInit,Injectable, Input, Output, EventEmitter } from '@angular/core';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import * as Moment from 'moment';
import {formatCurrency, getCurrencySymbol} from '@angular/common';
import { CountryService } from '../../shared/services/country.service';
import { RequestService } from 'app/shared/services/request.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { registerLocaleData, formatNumber } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { AuthService } from '../../shared/auth/auth.service';
import { ConfigCalculadoraService } from 'app/shared/services/config-calculadora.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import {NgbDatepickerI18n, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { ComentariosService } from 'app/shared/services/comentarios.service';
import { environment } from "../../../environments/environment";
import { MorososService } from 'app/shared/services/morosos.service';
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
  selector: 'app-detalle-abierto',
  templateUrl: './detalle-abierto.component.html',
  styleUrls: ['./detalle-abierto.component.scss'],
  providers: [I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n},DatePipe],
})
export class DetalleAbiertoComponent implements OnInit {

  @Input() exteral_solicitud_id: number;
  @Input() external: boolean = false;

  @Output() closeExternalId: EventEmitter<boolean>;
  @Output() expandExternal: EventEmitter<boolean>;

  folioElectronico = '';
  showFolio: boolean = false
  p=1;
  itemsPerPage = 5;
  currentJustify = 'fill';
  creditos;
  form: FormGroup;
  creditoAprobado=[];
  country$:Observable<any[]>;
  aprobados$: Observable<any[]>;
  usuario
  formInteres: FormGroup;
  formContratos: FormGroup;
  formPagoParcial: FormGroup;
  tablaContraOferta
  interesMoratorio = Math.pow(1+(22/100), (1/360))-1
  idSolicitud
  solicitud
  fechaPago
  cuota=0
  pagado =0
  pagado_todo =0
  interesMora =0 
  saldoVencimiento =0
  saldoDia =0
  diasMesesVencimiento =0
  diasMora = 0
  totalPagar = 0
  cuotasPagadas =0
  diasVanCredito = 0
  //variables config calculadoras
  configCalDias
  configCalMeses
  montoRestMeses = 0
  montoRestDias = 0
  diasRestMeses = 0
  diasRestDias = 0
  montoResTooltipDias = 0
  montoResTooltipMeses = 0
  porIvaDias = 0
  porIvaMeses = 0
  porplataformaDias = 0
  porplataformaMeses = 0
  porExpressDias = 0
  porExpressMeses = 0
  porExpressDosMeses = 0
  porExpressTresMeses = 0
  tasaDias = 0
  tasaMeses = 0
  contra_oferta;
  pagos;
  repagos;
  pagoProximo;
  pagoUltimo
  plazoDias;
  montoSolicitado;
  plataforma;
  t_interes;
  ap_express;
  iva;
  total;
  cuotaMensual;
  subtotal;
  taxInTotal;
  montoSolicitadoDias;
  t_interesDias;
  subtotalDias;
  plataformaDias;
  ap_expressDias;
  ivaDias;
  totalDias;
  t_interes_al_dia;
  plataforma_al_dia;
  plataforma_al_dia_p
  iva_al_dia;
  gastosCobranza = 0
  cuotaTotal = 0
  closeResult: string;
  montoP: string;
  montoTP: string;
  montoIM: string;
  montoG: string;
  contrato
  carta
  pagare
  comentarios
  ruta = environment.apiBase+"/storage/app/public/"
  capital_="$0.00"
  intereses_="$0.00"
  intereses_mora="$0.00"
  plataforma_="$0.00"
  aprobacion_rapida="$0.00"
  gastos_cobranza="$0.00"
  iva_="$0.00"
  total_no_pago = "$0.00"
  isAdmin=false
  factura
  pagado_novacion: any;
  totalPagarFinal = 0
  detalleCa
  diasVanCreditoUltimoPago
  pendientePagar=0;
  estatus_credito
  ivaGastosCobranza =0
  gastosCobranzaSinIva=0
  totalPagarSuma =0
  pagoProximoFechaPago
  cantidadCuotasMora=0
  fechaAct=""
  fecha_actual=""
  pagoAnticipadoDias={
    capital:0,
    intereses:0,
    plataforma:0,
    aprobacionRapida:0,
    iva:0,
    montoPagar:0,
    montoPagado:0,
    gastosCobranza:0,
    gastosCobranzaSinIva:0,
    ivaGastosCobranza:0,
    interesMora:0,
    diferenciaPago:0
  }
  pagoAnticipadoMeses={
    capital:0,
    intereses:0,
    plataforma:0,
    aprobacionRapida:0,
    iva:0,
    montoPagar:0,
    montoPagado:0,
    gastosCobranza:0,
    gastosCobranzaSinIva:0,
    ivaGastosCobranza:0,
    interesMora:0,
    diferenciaPago:0
  }

  avisoPreDias;
  avisoPreMeses;

  constructor(private toast: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private countriesService: CountryService,
    private requestService: RequestService,
    private auth : AuthService,
    private config: ConfigCalculadoraService,
    private modalService: NgbModal,
    private ComentariosService:ComentariosService,
    private morososService: MorososService
    ) { 
      this.form = this.fb.group({
        idPago: ['',Validators.required],
        montoPagado: ['', Validators.required],
        montoTotalPagar: ['', Validators.required],
        medioPago: ['', Validators.required],
        fechaPagado: ['', Validators.required],
        nroReferencia: ['', Validators.required],
        interesMora:['',Validators.required],
        gastosCobranza:['',Validators.required],
        idSolicitud:[''],
        concepto:['',Validators.required],
        factura:[''],
        diasMora:[0],
        cantidadCuotasMora:[0]
      });
      this.formInteres = this.fb.group({
        idPago: ['',Validators.required],
        interesMora:[0],
        gastosCobranza:[0],
        diasMora:[0],
        gastosCobranzaSinIva:[0],
        ivaGastosCobranza:[0],
        pagos:['']
      });
      this.formContratos = this.fb.group({
        id: ['',Validators.required],
        contrato: ['',Validators.required],
        carta: ['',Validators.required],
        pagare: ['',Validators.required]
      });
      this.formPagoParcial = this.fb.group({
        idUsuario: ['',Validators.required],
        idSolicitud:['',Validators.required],
        capital: [0, Validators.required],
        intereses:[0,Validators.required],
        interesesMora: [0, Validators.required],
        plataforma: [0, Validators.required],
        aprobacionRapida: [0, Validators.required],
        gastosCobranza:[0, Validators.required],
        iva:[0,Validators.required],
        totalNoPago:[0,Validators.required],
        fecha:['',Validators.required],
        concepto:['Pago parcial',Validators.required],
        nroReferencia:['',Validators.required],
        medioPago: ['', Validators.required],
        diasMora:[0]
      });

      this.closeExternalId = new EventEmitter();
      this.expandExternal = new EventEmitter();
    }


  ngOnInit() {
    registerLocaleData(localeEs, 'es');
    this.admin();
    this.configDias();
    this.configMeses();
    if (this.external) {
      this.idSolicitud = this.exteral_solicitud_id
      // console.log("ids",params)
      this.detalleCredito(this.exteral_solicitud_id)
      this.comentariosAll();
    }else{
      this.activatedRoute.params.subscribe((params)=>{
        if(params['id']){
          this.idSolicitud = params['id']
          
          // console.log("ids",params)
          this.detalleCredito(params['id'])
          this.comentariosAll();
          
        }
      })
    }
  }
  detalleCredito(id){
    this.cuota=0
    this.pagado =0
    this.interesMora =0 
    this.saldoVencimiento =0
    this.saldoDia =0
    this.diasMesesVencimiento =0
    this.diasMora = 0
    this.totalPagar = 0
    this.cuotasPagadas =0
    this.diasVanCredito = 0
    this.gastosCobranza = 0
    this.cuotaTotal = 0
    this.totalPagarSuma =0
    this.cantidadCuotasMora=0
    this.formInteres.controls["gastosCobranza"].setValue(0);
    this.formInteres.controls["interesMora"].setValue(0);
    this.pagos = []
    this.pendientePagar = 0
    this.totalPagarFinal =0
    this.gastosCobranzaSinIva=0
    this.ivaGastosCobranza=0
    let data = {
      'id':id
    }
    this.countriesService.showCreditoActivo(data).subscribe((res)=>{
      let fechaActual = Moment().format('YYYY-MM-DD');
      let diaAct = Moment().format('DD');
      let mesAct = Moment().format('MM');
      let anoAct = Moment().format('YYYY');
      this.detalleCa =JSON.parse(JSON.stringify(res))
      this.solicitud = JSON.parse(JSON.stringify(res)).solicitud
      this.estatus_credito = this.solicitud.estatus_credito
      this.contra_oferta = JSON.parse(JSON.stringify(res)).contra_oferta
      this.pagos = JSON.parse(JSON.stringify(res)).pagos
      this.repagos = JSON.parse(JSON.stringify(res)).repagos
      this.pagoProximo = JSON.parse(JSON.stringify(res)).pago_proximo
      this.pagoUltimo = JSON.parse(JSON.stringify(res)).pago_ultimo
      this.pagado = JSON.parse(JSON.stringify(res)).pagado
      this.pagado_todo = JSON.parse(JSON.stringify(res)).pagado_todo
      this.pagado_novacion = JSON.parse(JSON.stringify(res)).pagado_novacion
      this.cuotasPagadas = JSON.parse(JSON.stringify(res)).coutas_pagadas
      this.pagoProximoFechaPago = this.pagoProximo.fechaPago;
      let dvc
      let dvcup
      if(this.solicitud.tipoCredito == 'm'){
        if(this.fechaAct!=""){
          dvc = Moment(this.fechaAct).diff(this.solicitud.fechaDesembolso,'days')
        }else{
          dvc = Moment().diff(this.solicitud.fechaDesembolso,'days')
        }
        
        if(this.pagoUltimo){
          if(this.fechaAct!=""){
            dvcup = Moment(this.fechaAct).diff(this.pagoUltimo.fechaPago,'days')
          }else{
            dvcup = Moment().diff(this.pagoUltimo.fechaPago,'days')
          }
          
          // console.log('aquiii',this.pagoUltimo.fechaPago)
          if(dvcup<=0){
            this.diasVanCreditoUltimoPago =1
          }else{
            this.diasVanCreditoUltimoPago =dvcup
          }
        }
        
      }else{
        if(this.solicitud.estatus_credito == "novado"){
          if(this.fechaAct!=""){
            dvc = Moment(this.fechaAct).diff(this.solicitud.fechaNovado,'days')
          }else{
            dvc = Moment().diff(this.solicitud.fechaNovado,'days')
          }
          
        }else{
          if(this.fechaAct!=""){
            dvc = Moment(this.fechaAct).diff(this.solicitud.fechaDesembolso,'days')
          }else{
            dvc = Moment().diff(this.solicitud.fechaDesembolso,'days')
          }
          
        }
      }
      // console.log("van=>", dvc)
      this.form.controls["idPago"].setValue(this.pagoProximo.id);
      this.formInteres.controls["idPago"].setValue(this.pagoProximo.id);
      this.form.controls["idSolicitud"].setValue(this.idSolicitud);
      this.formPagoParcial.controls["idSolicitud"].setValue(this.idSolicitud);
      this.formPagoParcial.controls["idUsuario"].setValue(this.solicitud.idUserFk);
      this.formContratos.controls["id"].setValue(this.idSolicitud);
      if(dvc<=0){
        this.diasVanCredito = 1;
      }else{
        this.diasVanCredito = dvc;
      }
      if(this.solicitud.tipoCredito == 'm' ){
        this.fechaPago = Moment(this.solicitud.fechaDesembolso).add(this.solicitud.plazo, 'months').format('YYYY-MM-DD');
        if(this.solicitud.ofertaEnviada == 2){
          this.cuota = Math.round(parseFloat(this.solicitud.totalPagar)/parseInt(this.solicitud.plazo))-parseFloat(this.pagoProximo.montoPagado);
          // this.cuotaTotal = Math.round(parseFloat(this.solicitud.totalPagar)/parseInt(this.solicitud.plazo));
        }else{
          this.cuota = Math.round(parseFloat(this.contra_oferta.totalPagar)/parseInt(this.solicitud.plazo))-parseFloat(this.pagoProximo.montoPagado);
          // this.cuotaTotal = Math.round(parseFloat(this.contra_oferta.totalPagar)/parseInt(this.solicitud.plazo));
        }
        
        this.diasMesesVencimiento = parseInt(this.solicitud.plazo)-this.cuotasPagadas
      }else{
        this.fechaPago = this.pagoProximo.fechaPago;
        if(this.fechaAct!=""){
          if(this.fechaAct < this.fechaPago){
            this.diasMesesVencimiento = Moment(this.pagoProximo.fechaPago).diff(this.fechaAct,'days')
          }else{
            this.diasMesesVencimiento = 0
          }
        }else{
          if(fechaActual < this.fechaPago){
            this.diasMesesVencimiento = Moment(this.pagoProximo.fechaPago).diff(fechaActual,'days')
          }else{
            this.diasMesesVencimiento = 0
          }
        }
        
        
      }
      // console.log("van=>", this.diasVanCredito)
      let fechaPP= Moment(this.pagoProximo.fechaPago).format("YYYY-MM-DD")
      let difPP 
      if(this.fechaAct!=""){
        difPP = Moment(this.fechaAct).diff(fechaPP,'days')
      }else{
        difPP = Moment().diff(fechaPP,'days')
      }
      // console.log("DIF=> ", difPP);
      // if(this.solicitud.estatusIntereses == 1 && difPP > 0){
        if(difPP > 0){
          if(this.fechaAct!=""){
            this.diasMora = Moment(this.fechaAct).diff(fechaPP,'days');
          }else{
            this.diasMora = Moment().diff(fechaPP,'days');
          }
        
      }
      
      let montoInvertido = 0
      if(this.solicitud.ofertaEnviada == 2){
        montoInvertido = parseInt(this.solicitud.montoSolicitado)
        this.totalPagar= parseInt(this.solicitud.totalPagar)
        this.totalPagarFinal = this.detalleCa.suma_cuota+this.detalleCa.suma_interesMoraFull+this.detalleCa.suma_gastosCobranzaFull
      }else{
        montoInvertido = parseInt(this.contra_oferta.montoAprobado)
        this.totalPagar= parseInt(this.contra_oferta.totalPagar)
        this.totalPagarFinal = this.detalleCa.suma_cuota+this.detalleCa.suma_interesMoraFull+this.detalleCa.suma_gastosCobranzaFull
      }
      // if(this.solicitud.estatusIntereses == 1 && this.diasMora > 0){
        if(this.diasMora > 0){
          let dmp
        this.pagos.forEach((element,index) => {
          let im =0
          let endOfMonth = Moment(element.fechaPago).endOf('month').format('DD');
          if(this.fechaAct!=""){
            dmp =  Moment(this.fechaAct).diff(element.fechaPago,'days')
          }else{
            dmp =  Moment().diff(element.fechaPago,'days')
          }
            if(dmp<1){
              dmp = 0;  
            }else if(dmp>endOfMonth){
              dmp = endOfMonth
            }
            if(dmp>0 && element.estatusPago =="pendiente"){
              
              if(this.solicitud.tipoCredito=="d"){
                im = montoInvertido*Math.pow((1+this.interesMoratorio),dmp);
                // console.log("im=> ", im)
                let t = Math.round((im- montoInvertido)+parseFloat(element.interesMoraPendiente));
                this.pagos[index]['interesMora'] = t
                this.interesMora = this.interesMora+t;
              }else{
                im = element.saldoInicial*Math.pow((1+this.interesMoratorio),dmp);
                // console.log("im=> ", element.interesMoraPendiente)
                let t =Math.round((im- element.saldoInicial)+parseFloat(element.interesMoraPendiente)-parseFloat(element.interesMoraPagado));
                this.pagos[index]['interesMora'] = t
                this.interesMora = this.interesMora+t;
              }
              
              
              // this.cuotaTotal = this.cuotaTotal + parseFloat(element.montoPagar)+parseFloat(element.interesMora)+parseFloat(element.gastosCobranza)
              // this.pagos[index]['intereses'] = Math.round(im- montoInvertido);
            }
            // let im = montoInvertido*Math.pow((1+this.interesMoratorio),this.diasMora);
            // this.interesMora = Math.round(im- montoInvertido);
        });
        // console.log("IMMMM",this.interesMora)
      
      }else{
        let dmp
        this.pagos.forEach((element,index) => {
          let im =0
          let endOfMonth = Moment(element.fechaPago).endOf('month').format('DD');
          if(this.fechaAct!=""){
            dmp =  Moment(this.fechaAct).diff(element.fechaPago,'days')
          }else{
            dmp =  Moment().diff(element.fechaPago,'days')
          }
          
            if(dmp<1){
              dmp = 0;  
            }else if(dmp>endOfMonth){
              dmp = endOfMonth
            }
            if(element.estatusPago =="pendiente"){
              
              if(this.solicitud.tipoCredito=="d"){
                // im = montoInvertido*Math.pow((1+this.interesMoratorio),dmp);
                // console.log("im=> ", im)
                // let t = Math.round((im- montoInvertido)+parseFloat(element.interesMoraPendiente));
                this.pagos[index]['interesMora'] = parseFloat(element.interesMoraPendiente)
                this.interesMora = this.interesMora+parseFloat(element.interesMoraPendiente);
              }else{
                // im = element.saldoInicial*Math.pow((1+this.interesMoratorio),dmp);
                // console.log("im=> ", element.interesMoraPendiente)
                let t =Math.round((im- element.saldoInicial)+parseFloat(element.interesMoraPendiente));
                this.pagos[index]['interesMora'] = parseFloat(element.interesMoraPendiente)
                this.interesMora = this.interesMora+parseFloat(element.interesMoraPendiente);
              }
              
              
              // this.cuotaTotal = this.cuotaTotal + parseFloat(element.montoPagar)+parseFloat(element.interesMora)+parseFloat(element.gastosCobranza)
              // this.pagos[index]['intereses'] = Math.round(im- montoInvertido);
            }
            // let im = montoInvertido*Math.pow((1+this.interesMoratorio),this.diasMora);
            // this.interesMora = Math.round(im- montoInvertido);
        });
      }
      if(this.interesMora > 0){
        // console.log("IMMMM",this.interesMora)
        // this.totalPagar = this.totalPagar+this.interesMora
        // if(this.solicitud.tipoCredito == "m"){
        //   this.cuotaTotal = this.cuotaTotal+this.interesMora
        // }
        this.formInteres.controls["interesMora"].setValue(this.interesMora);
      }

      //cobranza
      // if(this.solicitud.estatusIntereses == 1 && this.diasMora > 0){
        if(this.diasMora > 0){
          let dmp
        if(this.solicitud.tipoCredito == 'm'){
          this.pagos.forEach((element,index) => {
            let endOfMonth = Moment(element.fechaPago).endOf('month').format('DD');
            if(this.fechaAct!=""){
              dmp =  Moment(this.fechaAct).diff(element.fechaPago,'days')
            }else{
              dmp =  Moment().diff(element.fechaPago,'days')
            }
          
            if(dmp<1){
              dmp = 0;  
            }else if(dmp>endOfMonth){
              dmp = endOfMonth
            }
            if(dmp>0 && element.estatusPago =="pendiente" && element.fechaPagado ==null){
              let cuot = element.montoPagar
              let gc = (cuot*30)/100;
              // this.gastosCobranzaSinIva = gc
              let ivagc = (gc*19)/100;
              // this.ivaGastosCobranza = ivagc
              let gct = gc+ivagc;
              if(dmp < 30){
                this.pagos[index]['gastosCobranzaSinIva'] = Math.round(((gc/30)*dmp)+parseFloat(element.gastosCobranzaSinIvaPendiente))
                this.pagos[index]['ivaGastosCobranza'] = Math.round(((ivagc/30)*dmp)+parseFloat(element.ivaGastosCobranzaPendiente))
                this.pagos[index]['gastosCobranza'] = Math.round(((gct/30)*dmp)+parseFloat(element.gastosCobranzaPendiente))
                // this.pagos[index]['ivaGastosCobranza'] = Math.round((ivagc/30)*dmp)
                // this.gastosCobranzaSinIva = Math.round((this.gastosCobranzaSinIva/30)*dmp)
                // this.ivaGastosCobranza = Math.round((this.ivaGastosCobranza/30)*dmp)
                this.gastosCobranza = this.gastosCobranza+this.pagos[index]['gastosCobranza'];
                this.gastosCobranzaSinIva = this.gastosCobranzaSinIva+this.pagos[index]['gastosCobranzaSinIva'];
                this.ivaGastosCobranza = this.ivaGastosCobranza+this.pagos[index]['ivaGastosCobranza'];
              }else{
                this.pagos[index]['gastosCobranzaSinIva'] = Math.round(gc+parseFloat(element.gastosCobranzaSinIvaPendiente))
                this.pagos[index]['ivaGastosCobranza'] = Math.round(ivagc+parseFloat(element.ivaGastosCobranzaPendiente))
                this.pagos[index]['gastosCobranza'] = Math.round(gct+parseFloat(element.gastosCobranzaPendiente))
                // this.pagos[index]['ivaGastosCobranza'] = Math.round((ivagc/30)*dmp)
                // this.gastosCobranzaSinIva = Math.round((this.gastosCobranzaSinIva/30)*dmp)
                // this.ivaGastosCobranza = Math.round((this.ivaGastosCobranza/30)*dmp)
                this.gastosCobranza = this.gastosCobranza+this.pagos[index]['gastosCobranza'];
                this.gastosCobranzaSinIva = this.gastosCobranzaSinIva+this.pagos[index]['gastosCobranzaSinIva'];
                this.ivaGastosCobranza = this.ivaGastosCobranza+this.pagos[index]['ivaGastosCobranza'];
              }
            }
          });
          // console.log("dias de mora", this.diasMora)
          // console.log("cuota",this.cuota)
          // console.log("gastos",this.gastosCobranzaSinIva)
          // console.log("iva gastos",this.ivaGastosCobranza)
          // console.log(this.gastosCobranza)
          // this.totalPagar = this.totalPagar+this.gastosCobranza;
          // this.cuotaTotal =this.cuotaTotal+this.gastosCobranza;
        }else{
          let gc = (this.totalPagar*30)/100;
          this.gastosCobranzaSinIva = gc
          let ivagc = (gc*19)/100;
          this.ivaGastosCobranza = ivagc
          this.gastosCobranza = gc+ivagc;
          if(this.diasMora < 60){
            this.gastosCobranzaSinIva = Math.round(((this.gastosCobranzaSinIva/60)*this.diasMora)+parseFloat(this.pagoProximo.gastosCobranzaSinIvaPendiente))
            this.ivaGastosCobranza = Math.round(((this.ivaGastosCobranza/60)*this.diasMora)+parseFloat(this.pagoProximo.ivaGastosCobranzaPendiente))
            this.gastosCobranza = Math.round(((this.gastosCobranza/60)*this.diasMora)+parseFloat(this.pagoProximo.gastosCobranzaPendiente));
          }
          this.pagos.forEach((element,index) => {
            if(element.estatusPago =="pendiente" && (element.fechaPagado ==null || element.fechaPagado =="")){
              this.pagos[index]['gastosCobranzaSinIva'] = Math.round(this.gastosCobranzaSinIva+parseFloat(element.gastosCobranzaSinIvaPendiente))
              this.pagos[index]['ivaGastosCobranza'] = Math.round(this.ivaGastosCobranza+parseFloat(element.ivaGastosCobranzaPendiente))
              this.pagos[index]['gastosCobranza'] = Math.round(this.gastosCobranza+parseFloat(element.gastosCobranzaPendiente))
          }
          })
          // console.log("%%",this.totalPagar);
          // console.log("%%",gc)
          // console.log("%%",ivagc)
          // console.log(this.gastosCobranza)
          // this.totalPagar = this.totalPagar+this.gastosCobranza;
        }
        this.formInteres.controls["gastosCobranza"].setValue(this.gastosCobranza);
        this.formInteres.controls["ivaGastosCobranza"].setValue(this.ivaGastosCobranza);
        this.formInteres.controls["gastosCobranzaSinIva"].setValue(this.gastosCobranzaSinIva);
        
      }else{
        // console.log("no dias")
        this.pagos.forEach((element,index) => {
          // console.log("no dias",element.estatusPago)
          if(element.estatusPago =="pendiente"){
            // console.log("no dias",parseFloat(element.gastosCobranzaSinIvaPendiente))
            this.pagos[index]['gastosCobranzaSinIva'] = parseFloat(element.gastosCobranzaSinIvaPendiente)
            this.pagos[index]['ivaGastosCobranza'] =parseFloat(element.ivaGastosCobranzaPendiente)
            this.pagos[index]['gastosCobranza'] = parseFloat(element.gastosCobranzaPendiente)
            this.gastosCobranza = this.gastosCobranza+this.pagos[index]['gastosCobranza'];
            if(this.solicitud.tipoCredito =="d"){
              this.gastosCobranzaSinIva = parseFloat(this.pagoProximo.gastosCobranzaSinIvaPendiente)
            this.ivaGastosCobranza = parseFloat(this.pagoProximo.ivaGastosCobranzaPendiente)
            this.gastosCobranza = parseFloat(this.pagoProximo.gastosCobranzaPendiente);
            }
        }
        })
      }

      this.saldoVencimiento = this.totalPagar-this.pagado
      this.totalPagar = this.totalPagar-this.pagado

      if(this.solicitud.tipoCredito == 'm' ){
        // if(this.diasMora == 0){
          this.obtenerMonto(montoInvertido, this.solicitud.plazo);
        // }else{
        //   this.saldoDia = Math.round(this.totalPagar+this.interesMora+this.gastosCobranza);
        // }
      }else{
        if(this.diasMora == 0){
          // console.log("SD",this.pagos.length)
          this.obtenerMonto2(montoInvertido, this.diasVanCredito);
        }else{
          this.saldoDia = Math.round(this.totalPagar+this.interesMora+this.gastosCobranza);
        }
      }

      // if(this.interesMora > 0 && this.gastosCobranza > 0){
        this.pagoProximo.interesMora = this.interesMora;
        this.pagoProximo.gastosCobranza =this.gastosCobranza;
        let p= 0
        let dmp
        this.pagos.forEach((element,index) => {
          
          if(this.solicitud.tipoCredito == 'd' && element.id == this.pagoProximo.id){
            this.pagos[index].interesMora = this.interesMora;
            this.pagos[index].gastosCobranzaSinIva = this.gastosCobranzaSinIva;
            this.pagos[index].ivaGastosCobranza = this.ivaGastosCobranza;
          }
          // let mesantes = Moment(element.fechaPago).subtract(1, 'months').format('YYYY-MM-DD');
          let endOfMonth = Moment(element.fechaPago).endOf('month').format('DD');
          if(this.fechaAct!=""){
            dmp =  Moment(this.fechaAct).diff(element.fechaPago,'days')
          }else{
            dmp =  Moment().diff(element.fechaPago,'days')
          }
          
            if(dmp<1){
              dmp = 0;  
            }else if(dmp>endOfMonth){
              dmp = endOfMonth
            }
            if(dmp>0 && element.estatusPago =="pendiente"){
              this.cuotaTotal = this.cuotaTotal + parseFloat(element.montoPagar)+parseFloat(element.interesMora)+parseFloat(element.gastosCobranza)
              this.pagos[index]['diasMora'] = dmp;
              this.pagoProximoFechaPago = element.fechaPago;
              this.cantidadCuotasMora = this.cantidadCuotasMora+1;
            }else{
              // this.pagos[index]['diasMora'] = 0;
              
            }
            
          this.pagos[index].montoPagar = parseFloat(element.montoPagar)+parseFloat(element.interesMora)+parseFloat(element.gastosCobranza)
          this.totalPagarSuma = this.totalPagarSuma+this.pagos[index].montoPagar
        });
        this.pagos.forEach((element,index) => {
          if(p>0){
            p = p-parseFloat(element.montoPagado);
            // console.log("entre en esta berga")
          }else{
            p = this.totalPagarSuma-parseFloat(element.montoPagado);
            // console.log("entre en esta mierda")
          }
          if(element.estatusPago == 'pagado'){
            if(p>=0){
              if(element.concepto == "Pago anticipado"){
                this.pagos[index]['pendientePagar'] = 0;
              }else{
                this.pagos[index]['pendientePagar'] = p;
                this.pendientePagar = p;
                // console.log('pendinete',p)
              }
            }else{
              this.pagos[index]['pendientePagar'] = 0;
            }
            
          }else{
            this.pagos[index]['pendientePagar'] = 0;
          }
          
          
        });
        // console.log("Cuotas morosas",this.cantidadCuotasMora);
        this.actualizarIntereses();
      // }
      if(this.solicitud.tipoCredito == 'd'){
        if(this.diasMora>0){
          this.monto_pagar(Math.round(this.saldoDia).toString());
        }else{
          if(this.pagos.length > 1){
            let j = this.pagos.length-1
            this.saldoDia = this.pagos[j].montoPagar
          }
          this.monto_pagar(this.pagoProximo.montoPagar.toString());
        }
      }else{
        let montoPa = this.pagoProximo.montoPagar+this.pagoProximo.interesMora+this.pagoProximo.gastosCobranza;
        this.monto_pagar(montoPa.toString());
      }
      this.monto_total_pagar(this.pagoProximo.montoPagar.toString());
      this.monto_intereses_re(this.interesMora.toString());
      this.monto_gastos(this.gastosCobranza.toString());
      // console.log("DM=>",this.diasMora)
    },(error)=>{
      console.log(error)
    })
  }
  actualizarIntereses(){
    // if(this.solicitud.estatusIntereses == 0){
    //   this.formInteres.controls["gastosCobranza"].setValue(0);
    //   this.formInteres.controls["interesMora"].setValue(0);
    // }
    this.formInteres.controls["diasMora"].setValue(this.diasMora);
    this.formInteres.controls["pagos"].setValue(this.pagos);
    this.countriesService.updatePagoIntereses(this.formInteres.value).subscribe(res =>{
      // console.log(res);
      this.estatus_credito = JSON.parse(JSON.stringify(res)).estatus
    },error=>{
      console.error(error);
    })
  }

  admin(){

    const roles = localStorage.getItem('roles');
    
    if (roles.trim()=='Administrador') {
      // console.log(roles);
      this.isAdmin=true;
    }else{
      this.isAdmin=false;
    }
    

  }
  configDias(){
    this.config.getTipo(2).subscribe((res)=>{
      this.configCalDias = res;
      this.plazoDias = (this.configCalDias ? parseInt(this.configCalDias.dias_minimo) : 15);
      this.montoRestDias = (this.configCalDias ? parseInt(this.configCalDias.monto_restriccion) : 0);
      this.montoResTooltipDias = (this.configCalDias ? parseInt(this.configCalDias.monto_restriccion_tooltip) : 0);
      this.diasRestDias = (this.configCalDias ? parseInt(this.configCalDias.dias_restriccion) : 0);
      this.tasaDias = (this.configCalDias ? parseFloat(this.configCalDias.tasa) : 0);
      this.porExpressDias = (this.configCalDias ? parseFloat(this.configCalDias.porcentaje_express) : 0);
      this.porIvaDias = (this.configCalDias ? parseFloat(this.configCalDias.porcentaje_iva) : 0);
      this.porplataformaDias = (this.configCalDias ? parseFloat(this.configCalDias.porcentaje_plataforma) : 0);
      // this.obtenerMonto2();
      // console.log("CalDias",this.tasaDias);
    },(error)=>{
      console.log(error)
    })
  }
  configMeses(){
    this.config.getTipo(1).subscribe((res)=>{
      this.configCalMeses = res;
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
      // console.log("CalMeses",this.tasaMeses);
    },(error)=>{
      console.log(error)
    })
  }  

  obtenerMonto(montoS,plazo){
    let porPlat = this.porplataformaMeses > 0 ? this.porplataformaMeses : 4;
    let porIva = this.porIvaMeses > 0 ? this.porIvaMeses : 19;
    let tasa = this.tasaMeses > 0 ? this.tasaMeses : 0.01916667;
    let porExpUno = this.porExpressMeses > 0 ? this.porExpressMeses : 30;
    let porExpDos = this.porExpressDosMeses > 0 ? this.porExpressDosMeses : 27.5;
    let porExpTres = this.porExpressTresMeses > 0 ? this.porExpressTresMeses : 25;
    this.montoSolicitado=montoS;
    this.plataforma=parseFloat(montoS)*(porPlat/100);
    let plazoInicialDias = parseInt(plazo)*30
      let cuotas=plazo;
      let monto=montoS;
      let interesMensual = this.pagoProximo.intereses/30
      let dvc
      let sumIntereses = 0
      let sumInteresesPendientes = 0
      let interesesAct = 0
      let sumdvc = 0
      let sumdvcp = 0
      this.t_interes = monto *( (tasa * Math.pow(1 + tasa, cuotas)) / (Math.pow(1 + tasa, cuotas) - 1) );
      
      this.getAmortizacion(tasa,montoS,plazo);
      this.pagos.forEach((element,index) => {
        let mesantes = Moment(element.fechaPago).subtract(1, 'months').format('YYYY-MM-DD');
        if(this.fechaAct!=""){
          dvc =  Moment(this.fechaAct).diff(mesantes,'days')
        }else{
          dvc =  Moment().diff(mesantes,'days')
        }
        
        interesesAct = 0
        if(dvc<1){
          if(index > 0){
            dvc = 0;  
          }else{
            dvc = 1; 
          }
          
        }else if(dvc>30){
          dvc = 30
        }
        console.log("dvc=>",dvc )
        sumdvc = sumdvc + dvc
        interesesAct = (parseInt(element.intereses)/30)*dvc
        
        console.log("intereses por dia=>",interesesAct )
        sumIntereses = sumIntereses+interesesAct
        if(element.estatusPago == "pendiente"){
          sumdvcp = sumdvcp + dvc
          sumInteresesPendientes = sumInteresesPendientes+interesesAct
        }
      });
      this.t_interes_al_dia = Math.ceil(sumIntereses);
      // if(this.cuotasPagadas>0){
      //   this.t_interes_al_dia = (interesMensual)*this.diasVanCreditoUltimoPago
      // }else{
      //   this.t_interes_al_dia = (interesMensual)*this.diasVanCredito
      // }
      // console.log('tasasas',this.t_interes_al_dia )
      // console.log('diasaaaa',sumdvc )
      // console.log('cuotasPagadas',this.cuotasPagadas )
      
      // this.t_interes_al_dia = (this.taxInTotal/plazoInicialDias)*this.diasVanCredito

      if(montoS<=1200000){
        this.ap_express=parseFloat(montoS)*porExpUno/100;
        // this.iva=(parseFloat(this.plataforma)+parseFloat(this.ap_express))*19/100;
        this.plataforma=parseFloat(this.plataforma)*parseFloat(plazo)
        this.plataforma_al_dia = (parseFloat(this.plataforma)/plazoInicialDias)*sumdvc
        this.plataforma_al_dia_p = (parseFloat(this.plataforma)/plazoInicialDias)*sumdvcp
        this.iva=(parseFloat(this.plataforma)+parseFloat(this.ap_express))*porIva/100;
        this.iva_al_dia=(this.plataforma_al_dia+parseFloat(this.ap_express))*porIva/100;
        this.total=parseFloat(this.subtotal)+parseFloat(this.plataforma)+parseFloat(this.ap_express)+parseFloat(this.iva)
        this.cuotaMensual=Math.round(parseFloat(this.total)/parseFloat(plazo))
        this.saldoDia = parseFloat(montoS)+this.t_interes_al_dia+this.plataforma_al_dia+parseFloat(this.ap_express)+this.iva_al_dia+this.interesMora+this.gastosCobranza;
        // this.saldoDia = parseFloat(montoS)+this.t_interes_al_dia+this.plataforma_al_dia+parseFloat(this.ap_express)+this.iva_al_dia;
        
      }else
      if(montoS>1200000 && montoS<=1700000){
        this.ap_express=parseFloat(montoS)*porExpDos/100;
        // this.iva=(parseFloat(this.plataforma)+parseFloat(this.ap_express))*19/100;

        this.plataforma=parseFloat(this.plataforma)*parseFloat(plazo)
        this.plataforma_al_dia = (parseFloat(this.plataforma)/plazoInicialDias)*sumdvc
        this.plataforma_al_dia_p = (parseFloat(this.plataforma)/plazoInicialDias)*sumdvcp
        this.iva=(parseFloat(this.plataforma)+parseFloat(this.ap_express))*porIva/100;
        this.iva_al_dia=(this.plataforma_al_dia+parseFloat(this.ap_express))*porIva/100;
        this.total=parseFloat(this.subtotal)+parseFloat(this.plataforma)+parseFloat(this.ap_express)+parseFloat(this.iva)
        this.cuotaMensual=Math.round(parseFloat(this.total)/parseFloat(plazo))
        this.saldoDia = parseFloat(montoS)+this.t_interes_al_dia+this.plataforma_al_dia+parseFloat(this.ap_express)+this.iva_al_dia+this.interesMora+this.gastosCobranza;        
        // this.saldoDia = parseFloat(montoS)+this.t_interes_al_dia+this.plataforma_al_dia+parseFloat(this.ap_express)+this.iva_al_dia;        
        
      }else
      if(montoS>=1700001){
        this.ap_express=parseFloat(montoS)*porExpTres/100;
        // this.iva=(parseFloat(this.plataforma)+parseFloat(this.ap_express))*19/100;
        this.plataforma=parseFloat(this.plataforma)*parseFloat(plazo)
        this.plataforma_al_dia = (parseFloat(this.plataforma)/plazoInicialDias)*sumdvc
        this.plataforma_al_dia_p = (parseFloat(this.plataforma)/plazoInicialDias)*sumdvcp
        let plata=parseFloat(this.plataforma)*parseFloat(plazo);
        this.iva=(parseFloat(this.plataforma)+parseFloat(this.ap_express))*porIva/100;
        this.iva_al_dia=(this.plataforma_al_dia+parseFloat(this.ap_express))*porIva/100;
        this.total=parseFloat(this.subtotal)+parseFloat(this.plataforma)+parseFloat(this.ap_express)+parseFloat(this.iva)
        this.cuotaMensual=Math.round(parseFloat(this.total)/parseFloat(plazo))
        this.saldoDia = parseFloat(montoS)+this.t_interes_al_dia+this.plataforma_al_dia+parseFloat(this.ap_express)+this.iva_al_dia+this.interesMora+this.gastosCobranza;
        // this.saldoDia = parseFloat(montoS)+this.t_interes_al_dia+this.plataforma_al_dia+parseFloat(this.ap_express)+this.iva_al_dia;        
        
      }
      this.pagoAnticipadoMeses.capital = montoS-this.detalleCa.suma_capital
      this.pagoAnticipadoMeses.intereses = Math.round(sumInteresesPendientes)
      this.pagoAnticipadoMeses.aprobacionRapida = this.ap_express-this.detalleCa.suma_aprobacionRapida
      this.pagoAnticipadoMeses.plataforma = this.plataforma_al_dia_p
      this.pagoAnticipadoMeses.iva = Math.round((this.pagoAnticipadoMeses.aprobacionRapida+this.pagoAnticipadoMeses.plataforma)*porIva/100);

      this.avisoPreMeses = {
        capital: montoS-this.detalleCa.suma_capital,
        intereses : Math.round(sumInteresesPendientes),
        aprobacionRapida : this.ap_express-this.detalleCa.suma_aprobacionRapida,
        plataforma : this.plataforma_al_dia_p,
        iva : Math.round((this.pagoAnticipadoMeses.aprobacionRapida+this.pagoAnticipadoMeses.plataforma)*porIva/100),
        interesesMoratorio : this.interesMora,
        gastosCobranza : this.gastosCobranzaSinIva,
        ivaGastosCobranza : this.ivaGastosCobranza,
        total: (montoS-this.detalleCa.suma_capital) + Math.round(sumInteresesPendientes) + (this.ap_express-this.detalleCa.suma_aprobacionRapida) + this.plataforma_al_dia_p + Math.round((this.pagoAnticipadoMeses.aprobacionRapida+this.pagoAnticipadoMeses.plataforma)*porIva/100) + this.interesMora + this.gastosCobranzaSinIva + this.ivaGastosCobranza
      }
      let sumamora = this.detalleCa.suma_gastosCobranzaSinIva+this.detalleCa.suma_ivaGastosCobranza+this.detalleCa.suma_interesMora
      let pago = this.pagado_todo-sumamora   

      console.log("SD",this.saldoDia)
      console.log("pagado",this.pagado)
      console.log("paga",pago)
      this.saldoDia = this.saldoDia - pago
      console.log(plazoInicialDias)
      console.log(montoS)
      console.log("PLA",this.plataforma)
      console.log("TSA",this.t_interes_al_dia)
      console.log("PLAD",this.plataforma_al_dia)
      console.log("AP",this.ap_express)
      console.log("IVA",this.iva_al_dia)
      console.log(this.saldoDia)
  }

 getAmortizacion(tasa,montoS,plazo) {
    var valor_de_cuota = this.t_interes;
    var saldo_al_capital = montoS;
    let interesos;
    let abono_al_capital:any;
    var items = new Array();
    let sum=0;
    let resta:any=1000;

    for (let i=0; i < plazo; i++) {
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

     this.taxInTotal=sum;
     this.subtotal=Math.round(parseFloat(this.montoSolicitado)+parseFloat(this.taxInTotal));
//  console.log('Items',items)
}
obtenerMonto2(montoS,plazo){
  let porPlat = this.porplataformaDias > 0 ? this.porplataformaDias : 1000;
  let porIva = this.porIvaDias > 0 ? this.porIvaDias : 19;
  let tasa = this.tasaDias > 0 ? this.tasaDias : 14;
  let porExp = this.porExpressDias > 0 ? this.porExpressDias : 12.5;
  this.plazoDias=plazo;
  this.montoSolicitadoDias=montoS;
  let tasitaNueva=(Math.pow((1+(tasa/100)),(this.plazoDias/360))-1);
  this.t_interesDias=tasitaNueva*this.montoSolicitadoDias;
  // console.log('tasainteres',this.t_interesDias)
  this.subtotalDias=parseFloat(this.montoSolicitadoDias)+parseFloat(this.t_interesDias);

  this.plataformaDias=porPlat*parseFloat(this.plazoDias);
  this.ap_expressDias=parseFloat(this.montoSolicitadoDias)*porExp/100
  this.ivaDias=(parseFloat(this.plataformaDias)+parseFloat(this.ap_expressDias))*porIva/100
  this.totalDias=parseFloat(this.subtotalDias)+parseFloat(this.plataformaDias)+parseFloat(this.ap_expressDias)+parseFloat(this.ivaDias)
  // console.log("TD=>",porExp)
  // console.log("TD=>",porIva)
  // console.log("TD=>",this.ivaDias)
  // console.log("TD=>",this.ap_expressDias)
  // console.log("TD=>",this.plataformaDias)
  // console.log("TD=>",this.subtotalDias)
  // console.log("TD=>",this.totalDias)
  this.pagoAnticipadoDias.capital = this.montoSolicitadoDias
  this.pagoAnticipadoDias.intereses = this.t_interesDias
  this.pagoAnticipadoDias.plataforma = this.plataformaDias
  this.pagoAnticipadoDias.aprobacionRapida =this.ap_expressDias
  this.pagoAnticipadoDias.iva = this.ivaDias
  this.pagoAnticipadoDias.montoPagar = this.totalDias
  this.saldoDia= Math.round(this.totalDias)+this.interesMora+this.gastosCobranza;

  this.avisoPreDias = {
    capital: this.montoSolicitadoDias,
    intereses : this.t_interesDias,
    aprobacionRapida : this.ap_expressDias,
    plataforma : this.plataforma_al_dia_p,
    iva : this.ivaDias,
    interesesMoratorio : this.interesMora,
    gastosCobranza : this.gastosCobranzaSinIva,
    ivaGastosCobranza : this.ivaGastosCobranza,
    total: this.montoSolicitadoDias + this.t_interesDias +  this.ap_expressDias + this.plataforma_al_dia_p + this.ivaDias + this.interesMora + this.gastosCobranzaSinIva + this.ivaGastosCobranza
  }
}

detalleDesembolso(id){
  let data = {id:id};
  this.countriesService.showDesembolso(data).subscribe((res)=>{
    let r = JSON.parse(JSON.stringify(res)).desembolso;
    let comentario = r.comentario != null ? r.comentario : '';
    let text= '<div class="row"><div class="col-md-6 col-md-offset-3" style="margin:auto; text-align:left !important;"><label>Nombres y Apellidos: </label><span>'+r.nombres+'</span><br><label>Nº cedula: </label><span>'+r.ncedula+'</span><br><label>Email: </label><span>'+r.email+'</span><br><label>Nombre del banco: </label><span>'+r.nombreBanco+'</span><br><label>Tipo de cuenta: </label><span>'+r.tipoCuenta+'</span><br><label>Nº de cuenta: </label><span>'+r.ncuenta+'</span><br><label>Monto a transferir: </label><span>'+formatCurrency(r.monto, 'en-US', getCurrencySymbol('USD', 'wide'))+'</span><br><label>Metodo de desembolso: </label><span>'+r.metodo+'</span><br><label>Fecha de desembolso: </label><span>'+r.created_at+'</span><br><label>Comentario: </label><span>'+comentario+'</span><br><label>Usuario que registro el desembolso: </label><span>'+r.registrador+'</span></div></div>'; 
    const confirm = swal.fire({
      title: "<strong style='color:#fdcb30'>¡Detalle del desembolso!</strong>",
      html: text,
      type: 'warning',
      showConfirmButton: true,
      showCancelButton: false,
      cancelButtonText: 'Cerrar',
      confirmButtonText: 'Cerrar',
      focusCancel: false,
      width: "80%",
      customClass: {
        icon: 'icon-class-yellow',
        confirmButton: 'confirm-button-class',
        cancelButton: 'cancel-button-class'
      }
    });
    // console.log(res);
  },(error)=>{
    console.log(error);
  })
}

repago(){
  console.log(this.form.value);
  const confirm = swal.fire({
    title: `Completar pago`,
    text: 'Esta acción no se puede deshacer',
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
      // console.log(this.form.value)
      let montoP = this.form.get('montoPagado').value
      let montoRest = 0
      let pagos = []
      let pCapital = 0
      let pAprobacion = 0
      let pInteres = 0
      let pInteresM = 0
      let pGastosC = 0
      let pIGastosC = 0
      let pPlataforma = 0
      let pIva = 0
      let capitalPagado = 0
      let aprobacionPagado = 0
      let interesPagado = 0
      let interesMPagado = 0
      let gastosCPagado = 0
      let ivaGastosCPagado = 0
      let plataformaPagado = 0
      let ivaPagado = 0
      let montoPendiente=0
      let pagosAct = []
      let pagoNew ={
        montoPagar:0,
        capital:0,
        intereses:0,
        interesMora:0,
        plataforma:0,
        aprobacionRapida:0,
        gastosCobranzaSinIva:0,
        ivaGastosCobranza:0,
        iva:0,
        fechaPago:"",
        fechaPagado:"",
        diasMora:0,
        montoPagado:0,
        concepto:""
      }
      let concepto = this.form.get('concepto').value;
      this.pagos.forEach((element,index) => {
        if(element.estatusPago=="pendiente"){
          pagos.push(element)
        }
      });
      if(concepto=="Pago cuota mensual morosa" ){
        for (let index = 0; index < this.cantidadCuotasMora; index++) {
          const element = pagos[index];
          
          if(montoP >= element.montoPagar){
            if(index == 0){
              montoRest = montoP-element.montoPagar
              pagos[index].montoPagado = element.montoPagar
            }else{
              montoRest = montoRest-element.montoPagar
              pagos[index].montoPagado = element.montoPagar
            }
            pagosAct.push(pagos[index]);
          }
          
          console.log(pagosAct)
        }
      }else if(concepto=="Pago incompleto"){
        montoRest = montoP
        console.log("pahos", pagos)
        for (let index = 0; index < pagos.length; index++) {
          const element = pagos[index];
          
          //sacar porcentajes
          pCapital = (parseFloat(element.capital)*100)/parseFloat(element.montoPagar)
          pInteres = (parseFloat(element.intereses)*100)/parseFloat(element.montoPagar)
          pInteresM = (parseFloat(element.interesMora)*100)/parseFloat(element.montoPagar)
          pPlataforma = (parseFloat(element.plataforma)*100)/parseFloat(element.montoPagar)
          pAprobacion = (parseFloat(element.aprobacionRapida)*100)/parseFloat(element.montoPagar)
          pGastosC = (parseFloat(element.gastosCobranzaSinIva)*100)/parseFloat(element.montoPagar)
          pIGastosC = (parseFloat(element.ivaGastosCobranza)*100)/parseFloat(element.montoPagar)
          pIva= (parseFloat(element.iva)*100)/parseFloat(element.montoPagar)
          // console.log("CAPITAL",pCapital)
          // console.log("pInteres",pInteres)
          // console.log("pInteresM",pInteresM)
          // console.log("pPlataforma",pPlataforma)
          // console.log("pAprobacion",pAprobacion)
          // console.log("pGastosC",pGastosC)
          // console.log("pIGastosC",pIGastosC)
          // console.log("pIva",pIva)

          //desglose pagado
          if(montoRest > 0){
            if(montoRest >= element.montoPagar){
              // console.log("mayor =")
              if(index == 0){
                montoRest = montoP-element.montoPagar
                pagos[index].montoPagado = element.montoPagar
                pagos[index].estatusPago = "pagado"
                pagos[index]['actCutota'] = 0
              }else{
                montoRest = montoRest-element.montoPagar
                pagos[index].montoPagado = element.montoPagar
                pagos[index].estatusPago = "pagado"
                pagos[index]['actCutota'] = 0
              }
              pagosAct.push(pagos[index]);
            }else{
              // console.log("mayor =",montoRest)
              capitalPagado = Math.round((montoRest*pCapital)/100);
              aprobacionPagado = Math.round((montoRest*pAprobacion)/100);
              interesPagado = Math.round((montoRest*pInteres)/100);
              interesMPagado = Math.round((montoRest*pInteresM)/100);
              plataformaPagado = Math.round((montoRest*pPlataforma)/100);
              gastosCPagado = Math.round((montoRest*pGastosC)/100);
              ivaGastosCPagado = Math.round((montoRest*pIGastosC)/100);
              ivaPagado = Math.round((montoRest*pIva)/100);
              montoPendiente = parseFloat(pagos[index].montoPagar)-montoRest
              // console.log("CP",montoPendiente)
              // console.log("CAPITAL",capitalPagado)
              // console.log("pInteres",interesPagado)
              // console.log("pInteresM",interesMPagado)
              // console.log("pPlataforma",plataformaPagado)
              // console.log("pAprobacion",aprobacionPagado)
              // console.log("pGastosC",gastosCPagado)
              // console.log("pIGastosC",ivaGastosCPagado)
              // console.log("pIva",ivaPagado)
              if(this.solicitud.tipoCredito=="m"){
                let i = index+1
                pagos[i].montoPagar = parseFloat(pagos[i].montoPagar)+montoPendiente
                pagos[i].capital = parseFloat(pagos[i].capital)+(parseFloat(pagos[index].capital)-capitalPagado)
                pagos[i].intereses = parseFloat(pagos[i].intereses)+(parseFloat(pagos[index].intereses)-interesPagado)
                pagos[i].interesMora = (parseFloat(pagos[index].interesMora)-interesMPagado)
                pagos[i].plataforma = parseFloat(pagos[i].plataforma)+(parseFloat(pagos[index].plataforma)-plataformaPagado)
                pagos[i].aprobacionRapida = parseFloat(pagos[i].aprobacionRapida)+(parseFloat(pagos[index].aprobacionRapida)-aprobacionPagado)
                pagos[i].gastosCobranzaSinIva = (parseFloat(pagos[index].gastosCobranzaSinIva)-gastosCPagado)
                pagos[i].ivaGastosCobranza = (parseFloat(pagos[index].ivaGastosCobranza)-ivaGastosCPagado)
                pagos[i].iva = parseFloat(pagos[i].iva)+(parseFloat(pagos[index].iva)-ivaPagado)
                pagos[i]['actCutota'] = 1
                pagosAct.push(pagos[i]);
              // console.log("CP",i)
              }else{
                pagoNew.montoPagar =montoPendiente
                pagoNew.capital =(pagos[index].capital-capitalPagado)
                pagoNew.intereses =(pagos[index].intereses-interesPagado)
                pagoNew.interesMora =(pagos[index].interesMora-interesMPagado)
                pagoNew.plataforma =(pagos[index].plataforma-plataformaPagado)
                pagoNew.aprobacionRapida =(pagos[index].aprobacionRapida-aprobacionPagado)
                pagoNew.gastosCobranzaSinIva =(pagos[index].gastosCobranzaSinIva-gastosCPagado)
                pagoNew.ivaGastosCobranza =(pagos[index].ivaGastosCobranza-ivaGastosCPagado)
                pagoNew.iva =(pagos[index].iva-ivaPagado)
                // console.log(pagoNew)
                this.pagos.push(pagoNew)
              }
              pagos[index].montoPagar = montoRest
              pagos[index].montoPagado = montoRest
              pagos[index].capital = capitalPagado
              pagos[index].intereses = interesPagado
              pagos[index].interesMora = interesMPagado
              pagos[index].plataforma = plataformaPagado
              pagos[index].aprobacionRapida = aprobacionPagado
              pagos[index].gastosCobranzaSinIva = gastosCPagado
              pagos[index].ivaGastosCobranza = ivaGastosCPagado
              pagos[index].iva = ivaPagado
              pagos[index].estatusPago = "pagado"
              pagos[index]['actCutota'] = 1
              pagosAct.push(pagos[index]);
              
              montoRest = 0
              // console.log("CP",capitalPagado)
            }
          }
          // console.log(pagosAct)
        }
      }else if(concepto=="Pago extra"){
        montoRest = montoP
        for (let index = 0; index < pagos.length; index++) {
          const element = pagos[index];
          //sacar porcentajes
          pCapital = Math.round((parseFloat(element.capital)*100)/parseFloat(element.montoPagar))
          pInteres = Math.round((parseFloat(element.intereses)*100)/parseFloat(element.montoPagar))
          pInteresM = Math.round((parseFloat(element.interesMora)*100)/parseFloat(element.montoPagar))
          pPlataforma = Math.round((parseFloat(element.plataforma)*100)/parseFloat(element.montoPagar))
          pAprobacion = Math.round((parseFloat(element.aprobacionRapida)*100)/parseFloat(element.montoPagar))
          pGastosC = Math.round((parseFloat(element.gastosCobranzaSinIva)*100)/parseFloat(element.montoPagar))
          pIGastosC = Math.round((parseFloat(element.ivaGastosCobranza)*100)/parseFloat(element.montoPagar))
          pIva= Math.round((parseFloat(element.iva)*100)/parseFloat(element.montoPagar))
          

          //desglose pagado
          if(montoRest > 0){
            console.log("CAPITAL",pCapital)
            console.log("pInteres",pInteres)
            console.log("pInteresM",pInteresM)
            console.log("pPlataforma",pPlataforma)
            console.log("pAprobacion",pAprobacion)
            console.log("pGastosC",pGastosC)
            console.log("pIGastosC",pIGastosC)
            console.log("pIva",pIva)
            if(montoRest >= element.montoPagar){
              // console.log("mayor =")
                if(index == 0){
                  montoRest = montoP-element.montoPagar
                  pagos[index].montoPagado = element.montoPagar
                  pagos[index].estatusPago = "pagado"
                  pagos[index]['actCutota'] = 0
              }else{
                montoRest = montoRest-element.montoPagar
                pagos[index].montoPagado = element.montoPagar
                pagos[index].estatusPago = "pagado"
                pagos[index]['actCutota'] = 0
              }
              pagosAct.push(pagos[index]);
            }else{
              // console.log("mayor =")
              capitalPagado = Math.round((montoRest*pCapital)/100);
              aprobacionPagado = Math.round((montoRest*pAprobacion)/100);
              interesPagado = Math.round((montoRest*pInteres)/100);
              interesMPagado = Math.round((montoRest*pInteresM)/100);
              plataformaPagado = Math.round((montoRest*pPlataforma)/100);
              gastosCPagado = Math.round((montoRest*pGastosC)/100);
              ivaGastosCPagado = Math.round((montoRest*pIGastosC)/100);
              ivaPagado = Math.round((montoRest*pIva)/100);
              
              if(this.solicitud.tipoCredito=="m"){
                let i = index
                pagos[i].montoPagado = montoRest
                pagos[i].montoPagar = parseFloat(pagos[i].montoPagar)-montoRest
                pagos[i].capital = parseFloat(pagos[i].capital)-capitalPagado
                pagos[i].intereses = parseFloat(pagos[i].intereses)-interesPagado
                pagos[i].interesMoraPagado = interesMPagado
                pagos[i].plataforma = parseFloat(pagos[i].plataforma)-plataformaPagado
                pagos[i].aprobacionRapida = parseFloat(pagos[i].aprobacionRapida)-aprobacionPagado
                pagos[i].gastosCobranzaSinIvaPagado = gastosCPagado
                pagos[i].ivaGastosCobranzaPagado = ivaGastosCPagado
                pagos[i].iva = parseFloat(pagos[i].iva)-ivaPagado
                pagos[index]['actCutota'] = 1
                pagosAct.push(pagos[i]);
              }
              
              montoRest = 0
              // console.log("CP",capitalPagado)
              console.log(pagosAct)
            }
          }
          
        }
      }else if(concepto=="Pago anticipado"){
        if(this.solicitud.tipoCredito == "d"){
          this.pagoAnticipadoDias.montoPagado =montoP
          this.pagoAnticipadoDias.interesMora = this.interesMora
          this.pagoAnticipadoDias.gastosCobranza= this.gastosCobranza
          this.pagoAnticipadoDias.gastosCobranzaSinIva=this.gastosCobranzaSinIva
          this.pagoAnticipadoDias.ivaGastosCobranza=this.ivaGastosCobranza
          this.pagoAnticipadoDias.diferenciaPago = this.totalPagarSuma-montoP
          console.log(this.pagoAnticipadoDias)
          // this.pagos.forEach((element,index) => {
          //   if(element.id == this.pagoProximo.id){
          //     this.pagos[index].montoPagar = this.pagoAnticipadoDias.montoPagar;
          //     this.pagos[index].montoPagado = this.pagoAnticipadoDias.montoPagado;
          //     this.pagos[index].capital = this.pagoAnticipadoDias.capital;
          //     this.pagos[index].intereses = this.pagoAnticipadoDias.intereses;
          //     this.pagos[index].aprobacionRapida = this.pagoAnticipadoDias.aprobacionRapida;
          //     this.pagos[index].plataforma = this.pagoAnticipadoDias.plataforma;
          //     this.pagos[index].iva = this.pagoAnticipadoDias.iva;
          //     this.pagos[index].montoRestante = this.pagoAnticipadoDias.diferenciaPago;
          //     this.pagos[index].interesMora = this.pagoAnticipadoDias.interesMora;
          //     this.pagos[index].gastosCobranza = this.pagoAnticipadoDias.gastosCobranza;
          //     this.pagos[index].gastosCobranzaSinIva = this.pagoAnticipadoDias.gastosCobranzaSinIva;
          //     this.pagos[index].ivaGastosCobranza = this.pagoAnticipadoDias.ivaGastosCobranza;
          //     this.pagos[index].estatusPago = "pagado";
          //     this.pagos[index].concepto = "Pago anticipado";
          //     this.pagos[index].fechaPagado = this.form.get('fechaPagado').value;
              
          //   }
          // });
        }else{
          this.pagoAnticipadoMeses.montoPagar = montoP-this.interesMora-this.gastosCobranza
          this.pagoAnticipadoMeses.montoPagado = montoP
          this.pagoAnticipadoMeses.interesMora=this.interesMora
          this.pagoAnticipadoMeses.gastosCobranza =this.gastosCobranza
          this.pagoAnticipadoMeses.gastosCobranzaSinIva = this.gastosCobranzaSinIva
          this.pagoAnticipadoMeses.ivaGastosCobranza = this.ivaGastosCobranza
          let pen = 0
          if(this.pendientePagar>0){
            pen =this.pendientePagar
          }else{
            pen = this.totalPagarSuma
          }
          this.pagoAnticipadoMeses.diferenciaPago = Math.round(pen-montoP)
          console.log(this.pagoAnticipadoMeses)
          // this.pagos.forEach((element,index) => {
          //   if(element.id == this.pagoProximo.id){
          //     this.pagos[index].montoPagar = this.pagoAnticipadoMeses.montoPagar;
          //     this.pagos[index].montoPagado = this.pagoAnticipadoMeses.montoPagado;
          //     this.pagos[index].capital = this.pagoAnticipadoMeses.capital;
          //     this.pagos[index].intereses = this.pagoAnticipadoMeses.intereses;
          //     this.pagos[index].aprobacionRapida = this.pagoAnticipadoMeses.aprobacionRapida;
          //     this.pagos[index].plataforma = this.pagoAnticipadoMeses.plataforma;
          //     this.pagos[index].iva = this.pagoAnticipadoMeses.iva;
          //     this.pagos[index].montoRestante = this.pagoAnticipadoMeses.diferenciaPago;
          //     this.pagos[index].interesMora = this.pagoAnticipadoMeses.interesMora;
          //     this.pagos[index].gastosCobranza = this.pagoAnticipadoMeses.gastosCobranza;
          //     this.pagos[index].gastosCobranzaSinIva = this.pagoAnticipadoMeses.gastosCobranzaSinIva;
          //     this.pagos[index].ivaGastosCobranza = this.pagoAnticipadoMeses.ivaGastosCobranza;
          //     this.pagos[index].estatusPago = "pagado";
          //     this.pagos[index].concepto = "Pago anticipado";
          //     this.pagos[index].fechaPagado = this.form.get('fechaPagado').value;
              
          //   }
          // });
          // let i=0
          // this.pagos.forEach((element,index) => {
          //   if(element.estatusPago == "pagado"){
          //     console.log(index)
          //     i=index
          //       // this.pagos.splice(index,1);
              
          //   }
          // })
          // if(i>0){
          //   this.pagos.splice(i+1);
          // }
          
          // console.log(this.pagos)
        }
      }
      let formData:FormData = new FormData();
      this.form.controls["diasMora"].setValue(this.diasMora);
      formData.append('idPago',this.form.get('idPago').value);
      formData.append('montoPagado',this.form.get('montoPagado').value);
      formData.append('montoTotalPagar',this.form.get('montoTotalPagar').value);
      formData.append('medioPago',this.form.get('medioPago').value);
      formData.append('fechaPagado',this.form.get('fechaPagado').value);
      formData.append('nroReferencia',this.form.get('nroReferencia').value);
      formData.append('interesMora',this.form.get('interesMora').value);
      formData.append('gastosCobranza',this.form.get('gastosCobranza').value);
      formData.append('idSolicitud',this.form.get('idSolicitud').value);
      formData.append('concepto',this.form.get('concepto').value);
      formData.append('factura', (this.factura != null ? this.factura : ''));
      formData.append('diasMora',this.form.get('diasMora').value);
      formData.append('pagosAct',JSON.stringify(pagosAct));
      formData.append('pagoNew',JSON.stringify(pagoNew));
      formData.append('pagoAnticipadoDias',JSON.stringify(this.pagoAnticipadoDias));
      formData.append('pagoAnticipadoMeses',JSON.stringify(this.pagoAnticipadoMeses));
      console.log(JSON.stringify(formData))
      // if(concepto != "Pago anticipado"){
      this.countriesService.updatePago(formData).subscribe(response => {
        if (response) {
          this.toast.success("Pago realizado con exito");
          this.form.reset();
          this.modalService.dismissAll();
          if(concepto == "Pago total credito" || concepto == "Pago anticipado" || concepto == "Pago ultima cuota" || concepto == "Pago total saldo al dia moroso"){
            this.router.navigate(['/admin/abiertos']);
          }else{
            this.detalleCredito(this.idSolicitud);
          }
          
        } else {
          this.toast.error("Error inesperado!");
        }
      });
    // }else{
    //   let p= 0
    //   let dmp
    //   if(this.solicitud.tipoCredito=="m"){
    //   this.totalPagarSuma =0
    //   }
    //   this.pagos.forEach((element,index) => {
          
    //     // if(this.solicitud.tipoCredito == 'd' && element.id == this.pagoProximo.id){
    //     //   this.pagos[index].interesMora = this.interesMora;
    //     //   this.pagos[index].gastosCobranzaSinIva = this.gastosCobranzaSinIva;
    //     //   this.pagos[index].ivaGastosCobranza = this.ivaGastosCobranza;
    //     // }
    //     // let mesantes = Moment(element.fechaPago).subtract(1, 'months').format('YYYY-MM-DD');
    //     let endOfMonth = Moment(element.fechaPago).endOf('month').format('DD');
    //     dmp =  Moment().diff(element.fechaPago,'days')
    //       if(dmp<1){
    //         dmp = 0;  
    //       }else if(dmp>endOfMonth){
    //         dmp = endOfMonth
    //       }
    //       if(dmp>0 && element.estatusPago =="pendiente"){
    //         this.cuotaTotal = this.cuotaTotal + parseFloat(element.montoPagar)+parseFloat(element.interesMora)+parseFloat(element.gastosCobranza)
    //         this.pagos[index]['diasMora'] = dmp;
    //         this.pagoProximoFechaPago = element.fechaPago;
    //         this.cantidadCuotasMora = this.cantidadCuotasMora+1;
    //       }else{
    //         // this.pagos[index]['diasMora'] = 0;
            
    //       }
          
    //     // this.pagos[index].montoPagar = parseFloat(element.montoPagar)+parseFloat(element.interesMora)+parseFloat(element.gastosCobranza)
    //     if(this.solicitud.tipoCredito=="m"){
    //     this.totalPagarSuma = this.totalPagarSuma+parseFloat(this.pagos[index].montoPagar)
    //     }
    //     if(p>0){
    //       p = p-parseInt(element.montoPagado);
    //     }else{
    //       p = this.totalPagarFinal-parseInt(element.montoPagado);
    //     }
    //     if(element.estatusPago == 'pagado'){
    //       if(p>=0){
    //         if(element.concepto == "Pago anticipado"){
    //           this.pagos[index]['pendientePagar'] = 0;
    //         }else{
    //           this.pagos[index]['pendientePagar'] = p;
    //           this.pendientePagar = p;
    //           // console.log('pendinete',p)
    //         }
            
    //       }else{
    //         this.pagos[index]['pendientePagar'] = 0;
    //       }
          
    //     }else{
    //       this.pagos[index]['pendientePagar'] = 0;
    //     }
        
        
    //   });
    // }
    }
  });
}

open(content) {
  this.modalService.open(content).result.then((result) => {
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

fechaSelect(event){
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
  this.form.controls['fechaPagado'].setValue(fecha);

}
fechaSelectAct(event){
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
  this.fechaAct=fecha;
  // console.log(this.fechaAct)
  this.detalleCredito(this.idSolicitud)

}
fechaSelectParcial(event){
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
  this.formPagoParcial.controls['fecha'].setValue(fecha);

}
monto_pagar(value: string) {
  // ing_mensuales
  this.form.controls["montoPagado"].setValue(value);
  // console.log(value)
  let val = parseInt(value, 10);
  if (Number.isNaN(val)) {
    val = 0;
  }
  this.montoP = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
}
monto_total_pagar(value: string) {
  // ing_mensuales
  this.form.controls["montoTotalPagar"].setValue(value);
  // console.log(value)
  let val = parseInt(value, 10);
  if (Number.isNaN(val)) {
    val = 0;
  }
  this.montoTP = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
}
monto_intereses_re(value: string) {
  // ing_mensuales
  this.form.controls["interesMora"].setValue(value);
  // console.log(value)
  let val = parseInt(value, 10);
  if (Number.isNaN(val)) {
    val = 0;
  }
  this.montoIM = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
}
monto_gastos(value: string) {
  // ing_mensuales
  this.form.controls["gastosCobranza"].setValue(value);
  // console.log(value)
  let val = parseInt(value, 10);
  if (Number.isNaN(val)) {
    val = 0;
  }
  this.montoG = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
}
  descargar(doc){
    if(doc == 1){
      let docContrato = this.solicitud.documentoContrato.split('/');
      let nomContrato = docContrato[docContrato.length - 1];
      this.countriesService.exportFirmados(this.solicitud.id_solicitud,1,nomContrato);
    }
    if(doc == 2){
      let docCarta = this.solicitud.documentoCarta.split('/');
      let nomCarta = docCarta[docCarta.length - 1];
      this.countriesService.exportFirmados(this.solicitud.id_solicitud,2,nomCarta);
    }
    if(doc == 3){
      let docPagare = this.solicitud.documentoPagare.split('/');
      let nomPagare = docPagare[docPagare.length - 1];
      // console.log(nom);
      this.countriesService.exportFirmados(this.solicitud.id_solicitud,3,nomPagare);
    }

    
    
    
    
  }
  descargarFactura(){
    this.countriesService.exportFactura(this.solicitud.id_solicitud);
  }
  editContratos() {
    if (this.formContratos.valid) {
      let formData:FormData = new FormData();
      formData.append('id',this.solicitud.id_solicitud);
      formData.append('contrato', (this.contrato != null ? this.contrato : ''));
      formData.append('carta', (this.carta != null ? this.carta : ''));
      formData.append('pagare', (this.pagare != null ? this.pagare : ''));
      this.countriesService.updateContratos(formData).subscribe(response => {
        if (response) {
          this.modalService.dismissAll();
          this.formContratos.reset();
          this.toast.success("Datos actualizados con exito!");
          this.detalleCredito(this.idSolicitud);
        } else {
          this.toast.error("Error inesperado!");
        }
      });
    }
    // console.log(this.formTestimonial.value);
  }
  onFileChangeContrato(event) {
    const reader = new FileReader();
    let fileList: FileList = event.target.files;
    let uploadedImage: Blob;
 
    if(event.target.files && event.target.files.length) {
      
      const [file2] = event.target.files;
      let file: File = fileList[0];
      
      reader.readAsDataURL(file2);
      // console.log(file2);
        reader.onload = () => {
            
            this.contrato = reader.result;
            var res = this.contrato.split(",");
            this.contrato = res[1];
            // this.nombreImagen = file.name;
            // console.log(file.name)
        // need to run CD since file load runs outside of zone
        // this.cd.markForCheck();
        };
    }
  }

  onFileChangeCarta(event) {
    const reader = new FileReader();
    let fileList: FileList = event.target.files;
    let uploadedImage: Blob;
 
    if(event.target.files && event.target.files.length) {
      
      const [file2] = event.target.files;
      let file: File = fileList[0];
      
      reader.readAsDataURL(file2);
      // console.log(file2);
        reader.onload = () => {
            
            this.carta = reader.result;
            var res = this.carta.split(",");
            this.carta = res[1];
            // this.nombreImagen = file.name;
            // console.log(file.name)
        // need to run CD since file load runs outside of zone
        // this.cd.markForCheck();
        };
    }
  }

  onFileChangePagare(event) {
    const reader = new FileReader();
    let fileList: FileList = event.target.files;
    let uploadedImage: Blob;
 
    if(event.target.files && event.target.files.length) {
      
      const [file2] = event.target.files;
      let file: File = fileList[0];
      
      reader.readAsDataURL(file2);
      // console.log(file2);
        reader.onload = () => {
            
            this.pagare = reader.result;
            var res = this.pagare.split(",");
            this.pagare = res[1];
            // this.nombreImagen = file.name;
            // console.log(file.name)
        // need to run CD since file load runs outside of zone
        // this.cd.markForCheck();
        };
    }
  }
  onFileChangeFactura(event) {
    const reader = new FileReader();
    let fileList: FileList = event.target.files;
    let uploadedImage: Blob;
 
    if(event.target.files && event.target.files.length) {
      
      const [file2] = event.target.files;
      let file: File = fileList[0];
      
      reader.readAsDataURL(file2);
      // console.log(file2);
        reader.onload = () => {
            
            this.factura = reader.result;
            var res = this.factura.split(",");
            this.factura = res[1];
            // this.nombreImagen = file.name;
            // console.log(file.name)
        // need to run CD since file load runs outside of zone
        // this.cd.markForCheck();
        };
    }
  }
  comentariosAll(){

    this.ComentariosService.getComentariosSolicitud({idSolicitudFk:this.idSolicitud}).subscribe(response => {
      // console.log("obtener los comentos data credito",response)
      this.comentarios=JSON.parse(JSON.stringify(response)).data;
  
      // console.log('veamos',this.comentarios)
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
            this.comentariosAll()
          } else {
            this.toast.error("Error inesperado!");
          }
        });
      }
    });
  }

  cambioEstatusIntereses(){
    let params = {
      id:this.idSolicitud,
      estatusIntereses : this.solicitud.estatusIntereses == 1 ? 0 : 1
    }
    this.countriesService.updateEstatusIntereses(params).subscribe((res)=>{
      // console.log(res);
      this.detalleCredito(this.idSolicitud);
    },(error)=>{
      console.log(error);
    })
  }
  cambioConcepto(event){
    // console.log("concepto=>",event);
    if(event == "Novacion"){
      let mn = 0
      if(this.solicitud.ofertaEnviada == 2){
        mn = parseInt(this.solicitud.tasaInteres)+parseInt(this.solicitud.plataforma)+parseInt(this.solicitud.aprobacionRapida)+parseInt(this.solicitud.iva);
      }else{
        mn = parseInt(this.contra_oferta.tasaInteres)+parseInt(this.contra_oferta.plataforma)+parseInt(this.contra_oferta.aprobacionRapida)+parseInt(this.contra_oferta.iva);
      }
      this.monto_pagar(mn.toString());
    }else if(event == "Pago total credito"){
      this.monto_pagar(this.pagoProximo.montoPagar.toString());
    }else if(event == "Pago anticipado" || event=="Pago total saldo al dia moroso"){
      this.monto_pagar(Math.round(this.saldoDia).toString());
    }else if(event == "Pago cuota mensual" || event=="Pago ultima cuota"){
      this.monto_pagar(this.pagoProximo.montoPagar.toString());
    }else if(event == "Pago cuota mensual morosa"){
      this.monto_pagar(this.cuotaTotal.toString());
    }else{
      let a = 0;
      this.monto_pagar(a.toString());
    }

  }
  limpiarMontoP(){
 
    if(this.montoP !='$0.00'){
     
    }else{
     this.montoP='';
    }
    
  }

  monto_capital(value: string) {
    // ing_mensuales
    
    this.formPagoParcial.controls["capital"].setValue(value);
    let capital = this.formPagoParcial.get('capital').value
    let intereses = this.formPagoParcial.get('intereses').value
    let interesesMora = this.formPagoParcial.get('interesesMora').value
    let plataforma = this.formPagoParcial.get('plataforma').value
    let aprobacionRapida = this.formPagoParcial.get('aprobacionRapida').value
    let gastosCobranza = this.formPagoParcial.get('gastosCobranza').value
    let iva = this.formPagoParcial.get('iva').value
    let suma = parseInt(capital)+parseInt(intereses)+parseInt(interesesMora)+parseInt(plataforma)+parseInt(aprobacionRapida)+parseInt(gastosCobranza)+parseInt(iva);
    this.monto_total_no_pago(suma.toString());
    // console.log(value)
    let val = parseInt(value, 10);
    if (Number.isNaN(val)) {
      val = 0;
    }
    this.capital_ = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
  }
  monto_intereses(value: string) {
    // ing_mensuales
    this.formPagoParcial.controls["intereses"].setValue(value);
    let capital = this.formPagoParcial.get('capital').value
    let intereses = this.formPagoParcial.get('intereses').value
    let interesesMora = this.formPagoParcial.get('interesesMora').value
    let plataforma = this.formPagoParcial.get('plataforma').value
    let aprobacionRapida = this.formPagoParcial.get('aprobacionRapida').value
    let gastosCobranza = this.formPagoParcial.get('gastosCobranza').value
    let iva = this.formPagoParcial.get('iva').value
    let suma = parseInt(capital)+parseInt(intereses)+parseInt(interesesMora)+parseInt(plataforma)+parseInt(aprobacionRapida)+parseInt(gastosCobranza)+parseInt(iva);
    this.monto_total_no_pago(suma.toString());
    // console.log(value)
    let val = parseInt(value, 10);
    if (Number.isNaN(val)) {
      val = 0;
    }
    this.intereses_ = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
  }
  monto_intereses_mora(value: string) {
    // ing_mensuales
    this.formPagoParcial.controls["interesesMora"].setValue(value);
    let capital = this.formPagoParcial.get('capital').value
    let intereses = this.formPagoParcial.get('intereses').value
    let interesesMora = this.formPagoParcial.get('interesesMora').value
    let plataforma = this.formPagoParcial.get('plataforma').value
    let aprobacionRapida = this.formPagoParcial.get('aprobacionRapida').value
    let gastosCobranza = this.formPagoParcial.get('gastosCobranza').value
    let iva = this.formPagoParcial.get('iva').value
    let suma = parseInt(capital)+parseInt(intereses)+parseInt(interesesMora)+parseInt(plataforma)+parseInt(aprobacionRapida)+parseInt(gastosCobranza)+parseInt(iva);
    this.monto_total_no_pago(suma.toString());
    // console.log(value)
    let val = parseInt(value, 10);
    if (Number.isNaN(val)) {
      val = 0;
    }
    this.intereses_mora = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
  }
  monto_plataforma(value: string) {
    // ing_mensuales
    this.formPagoParcial.controls["plataforma"].setValue(value);
    let capital = this.formPagoParcial.get('capital').value
    let intereses = this.formPagoParcial.get('intereses').value
    let interesesMora = this.formPagoParcial.get('interesesMora').value
    let plataforma = this.formPagoParcial.get('plataforma').value
    let aprobacionRapida = this.formPagoParcial.get('aprobacionRapida').value
    let gastosCobranza = this.formPagoParcial.get('gastosCobranza').value
    let iva = this.formPagoParcial.get('iva').value
    let suma = parseInt(capital)+parseInt(intereses)+parseInt(interesesMora)+parseInt(plataforma)+parseInt(aprobacionRapida)+parseInt(gastosCobranza)+parseInt(iva);
    this.monto_total_no_pago(suma.toString());
    // console.log(value)
    let val = parseInt(value, 10);
    if (Number.isNaN(val)) {
      val = 0;
    }
    this.plataforma_ = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
  }
  monto_aprobacion_rapida(value: string) {
    // ing_mensuales
    this.formPagoParcial.controls["aprobacionRapida"].setValue(value);
    let capital = this.formPagoParcial.get('capital').value
    let intereses = this.formPagoParcial.get('intereses').value
    let interesesMora = this.formPagoParcial.get('interesesMora').value
    let plataforma = this.formPagoParcial.get('plataforma').value
    let aprobacionRapida = this.formPagoParcial.get('aprobacionRapida').value
    let gastosCobranza = this.formPagoParcial.get('gastosCobranza').value
    let iva = this.formPagoParcial.get('iva').value
    let suma = parseInt(capital)+parseInt(intereses)+parseInt(interesesMora)+parseInt(plataforma)+parseInt(aprobacionRapida)+parseInt(gastosCobranza)+parseInt(iva);
    this.monto_total_no_pago(suma.toString());
    // console.log(value)
    let val = parseInt(value, 10);
    if (Number.isNaN(val)) {
      val = 0;
    }
    this.aprobacion_rapida = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
  }
  monto_gastos_cobranza(value: string) {
    // ing_mensuales
    this.formPagoParcial.controls["gastosCobranza"].setValue(value);
    let capital = this.formPagoParcial.get('capital').value
    let intereses = this.formPagoParcial.get('intereses').value
    let interesesMora = this.formPagoParcial.get('interesesMora').value
    let plataforma = this.formPagoParcial.get('plataforma').value
    let aprobacionRapida = this.formPagoParcial.get('aprobacionRapida').value
    let gastosCobranza = this.formPagoParcial.get('gastosCobranza').value
    let iva = this.formPagoParcial.get('iva').value
    let suma = parseInt(capital)+parseInt(intereses)+parseInt(interesesMora)+parseInt(plataforma)+parseInt(aprobacionRapida)+parseInt(gastosCobranza)+parseInt(iva);
    this.monto_total_no_pago(suma.toString());
    // console.log(value)
    let val = parseInt(value, 10);
    if (Number.isNaN(val)) {
      val = 0;
    }
    this.gastos_cobranza = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
  }
  monto_iva(value: string) {
    // ing_mensuales
    this.formPagoParcial.controls["iva"].setValue(value);
    let capital = this.formPagoParcial.get('capital').value
    let intereses = this.formPagoParcial.get('intereses').value
    let interesesMora = this.formPagoParcial.get('interesesMora').value
    let plataforma = this.formPagoParcial.get('plataforma').value
    let aprobacionRapida = this.formPagoParcial.get('aprobacionRapida').value
    let gastosCobranza = this.formPagoParcial.get('gastosCobranza').value
    let iva = this.formPagoParcial.get('iva').value
    let suma = parseInt(capital)+parseInt(intereses)+parseInt(interesesMora)+parseInt(plataforma)+parseInt(aprobacionRapida)+parseInt(gastosCobranza)+parseInt(iva);
    this.monto_total_no_pago(suma.toString());
    // console.log(value)
    let val = parseInt(value, 10);
    if (Number.isNaN(val)) {
      val = 0;
    }
    this.iva_ = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
  }

  monto_total_no_pago(value: string) {
    // ing_mensuales
    this.formPagoParcial.controls["totalNoPago"].setValue(value);
    // console.log(value)
    let val = parseInt(value, 10);
    if (Number.isNaN(val)) {
      val = 0;
    }
    this.total_no_pago = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
  }

  pagoParcial(){
    this.formPagoParcial.controls["diasMora"].setValue(this.diasMora);
    // console.log(this.formPagoParcial.value);
    const confirm = swal.fire({
      title: `Castigar credito`,
      text: 'Esta acción no se puede deshacer',
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
        // console.log(this.form.value)

        this.countriesService.createPagoParcial(this.formPagoParcial.value).subscribe(response => {
          if (response) {
            this.toast.success("Castigado con exito");
            this.formPagoParcial.reset();
            // this.modalService.dismissAll();
            this.router.navigate(['/admin/abiertos']);

          } else {
            this.toast.error("Error inesperado!");
          }
        });
      }
    });
  }
  limpiarFechaAct(){
    this.fechaAct =""
    this.fecha_actual=""
    this.detalleCredito(this.idSolicitud)
  }

  closeExternal(){
    this.closeExternalId.emit(false);
  }
  expandPanel(){
    this.expandExternal.emit(true);
  }

  generateDescuentoLibranzaPdf(){
    let params = {
      fullName: this.solicitud.first_name + ' ' + this.solicitud.second_name+ ' ' + this.solicitud.last_name+ ' '+this.solicitud.second_last_name,
      document: this.solicitud.n_document,
      saldoDia: this.pendientePagar / this.pagos.length,
      userId: this.solicitud.idUserFk,
    }
    this.morososService.generateDescuentoLibranzaPdf(params);
  }

  generateAvisoPrejuridicoPdf(){

    console.log(this.solicitud);
    
    
    let params = {
      fullName: this.solicitud.first_name + ' ' + this.solicitud.second_name+ ' ' + this.solicitud.last_name+ ' '+this.solicitud.second_last_name,
      document: this.solicitud.n_document,
      saldoDia: this.saldoDia,
      montoDesembolso: this.solicitud.ofertaEnviada == 2 ? this.solicitud.montoSolicitado : this.contra_oferta.montoAprobado,
      userId: this.solicitud.idUserFk,
      gastosCobranza: this.gastosCobranza,
      montos: this.solicitud.tipoCredito === 'm' ? JSON.stringify(this.avisoPreMeses) : JSON.stringify(this.avisoPreDias)
    }
    this.morososService.generateAvisoPrejuridicoPdf(params);
  }

  generateControlBancoPdf(){
    
    if (this.folioElectronico === '') {
      this.toast.error("Ingrese el número de folio electrónico");
      
    }else{

      let params = {
        fullName: this.solicitud.first_name + ' ' + this.solicitud.second_name+ ' ' + this.solicitud.last_name+ ' '+this.solicitud.second_last_name,
        document: this.solicitud.n_document,
        saldoDia: this.saldoDia,
        userId: this.solicitud.idUserFk,
        nCredito: this.solicitud.numero_credito,
        folioElectronico: this.folioElectronico
      }
      this.morososService.generateControlBancoPdf(params);
    }
  }
}
