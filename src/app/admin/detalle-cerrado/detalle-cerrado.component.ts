import { Component, OnInit,Injectable } from '@angular/core';
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
  selector: 'app-detalle-cerrado',
  templateUrl: './detalle-cerrado.component.html',
  styleUrls: ['./detalle-cerrado.component.scss'],
  providers: [I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n},DatePipe],
})
export class DetalleCerradoComponent implements OnInit {

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
  pagos_parciales;
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
  totalPagarParcial = 0;
  totalPagarFinalParcial: number;
  pagado_intereses: any;
  pagado_gastos: any;
  dias_mora: any;
  pagoUltimo
  detalleCa
  diasVanCreditoUltimoPago
  pendientePagar =0 ;
  ivaGastosCobranza =0
  gastosCobranzaSinIva=0
  totalPagarSuma =0
  pagoProximoFechaPago
  cantidadCuotasMora=0

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
    ) { 
      this.form = this.fb.group({
        idPago: ['',Validators.required],
        montoPagado: ['', Validators.required],
        medioPago: ['', Validators.required],
        fechaPagado: ['', Validators.required],
        nroReferencia: ['', Validators.required],
        interesMora:[0],
        gastosCobranza:[0],
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
        capital: ['', Validators.required],
        intereses:['',Validators.required],
        interesesMora: ['', Validators.required],
        plataforma: ['', Validators.required],
        aprobacionRapida: ['', Validators.required],
        gastosCobranza:['', Validators.required],
        iva:['',Validators.required],
        totalNoPago:['',Validators.required]
      });
    }


  ngOnInit() {
    registerLocaleData(localeEs, 'es');
    this.admin();
    this.configDias();
    this.configMeses();
    this.activatedRoute.params.subscribe((params)=>{
      if(params['id']){
        this.idSolicitud = params['id']
        
        // console.log("ids",params)
        this.detalleCredito(params['id'])
        this.comentariosAll();
        
      }
    })
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
    let data = {
      'id':id
    }
    this.countriesService.showCreditoCerrado(data).subscribe((res)=>{
      let fechaAct = Moment().format('YYYY-MM-DD');
      let diaAct = Moment().format('DD');
      let mesAct = Moment().format('MM');
      let anoAct = Moment().format('YYYY');
      this.detalleCa =JSON.parse(JSON.stringify(res))
      this.solicitud = JSON.parse(JSON.stringify(res)).solicitud
      this.contra_oferta = JSON.parse(JSON.stringify(res)).contra_oferta
      this.pagos = JSON.parse(JSON.stringify(res)).pagos
      this.repagos = JSON.parse(JSON.stringify(res)).repagos
      this.pagos_parciales = JSON.parse(JSON.stringify(res)).pargos_parciales
      this.pagoProximo = JSON.parse(JSON.stringify(res)).pago_proximo
      this.pagoUltimo = JSON.parse(JSON.stringify(res)).pago_ultimo
      this.pagado = JSON.parse(JSON.stringify(res)).pagado
      this.pagado_todo = JSON.parse(JSON.stringify(res)).pagado_todo
      this.pagado_novacion = JSON.parse(JSON.stringify(res)).pagado_novacion
      this.pagado_intereses = JSON.parse(JSON.stringify(res)).pagado_intereses
      this.pagado_gastos = JSON.parse(JSON.stringify(res)).pagado_gastos
      this.dias_mora = JSON.parse(JSON.stringify(res)).dias_mora
      this.cuotasPagadas = JSON.parse(JSON.stringify(res)).coutas_pagadas
      // this.pagoProximoFechaPago = this.pagoProximo.fechaPago;
      let dvc
      let dvcup
      if(this.solicitud.tipoCredito == 'm'){
        dvc = Moment().diff(this.solicitud.fechaDesembolso,'days')
        if(this.pagoUltimo){
          dvcup = Moment().diff(this.pagoUltimo.fechaPago,'days')
          if(dvcup<=0){
            this.diasVanCreditoUltimoPago =1
          }else{
            this.diasVanCreditoUltimoPago =dvcup
          }
        }
        
      }else{
        if(this.solicitud.estatus_credito == "novado"){
          dvc = Moment().diff(this.solicitud.fechaNovado,'days')
        }else{
          dvc = Moment().diff(this.solicitud.fechaDesembolso,'days')
        }
      }
      // console.log("van=>", dvc)
      // this.form.controls["idPago"].setValue(this.pagoProximo.id);
      // this.formInteres.controls["idPago"].setValue(this.pagoProximo.id);
      // this.form.controls["idSolicitud"].setValue(this.idSolicitud);
      // this.formPagoParcial.controls["idSolicitud"].setValue(this.idSolicitud);
      // this.formPagoParcial.controls["idUsuario"].setValue(this.solicitud.idUserFk);
      // this.formContratos.controls["id"].setValue(this.idSolicitud);
      if(dvc<=0){
        this.diasVanCredito = 1;
      }else{
        this.diasVanCredito = dvc;
      }
      if(this.solicitud.tipoCredito == 'm' ){
        this.fechaPago = Moment(this.solicitud.fechaDesembolso).add(this.solicitud.plazo, 'months').format('YYYY-MM-DD');
        if(this.solicitud.ofertaEnviada == 2){
          this.cuota = Math.round(parseFloat(this.solicitud.totalPagar)/parseInt(this.solicitud.plazo));
          // this.cuotaTotal = Math.round(parseFloat(this.solicitud.totalPagar)/parseInt(this.solicitud.plazo));
        }else{
          this.cuota = Math.round(parseFloat(this.contra_oferta.totalPagar)/parseInt(this.solicitud.plazo));
          // this.cuotaTotal = Math.round(parseFloat(this.contra_oferta.totalPagar)/parseInt(this.solicitud.plazo));
        }
        
        this.diasMesesVencimiento = parseInt(this.solicitud.plazo)-this.cuotasPagadas
      }else{
        // this.fechaPago = this.pagoProximo.fechaPago;
        this.fechaPago = Moment(this.solicitud.fechaDesembolso).add(this.solicitud.plazo, 'days').format('YYYY-MM-DD');
        if(fechaAct < this.fechaPago){
          this.diasMesesVencimiento = Moment(this.pagoUltimo.fechaPago).diff(fechaAct,'days')
        }else{
          this.diasMesesVencimiento = 0
        }
        
      }
      // console.log("van=>", this.diasVanCredito)
      let fechaPP= Moment(this.pagoUltimo.fechaPago).format("YYYY-MM-DD")
      let difPP = Moment().diff(fechaPP,'days')
      // console.log("DIF=> ", difPP);
      if(this.solicitud.estatusIntereses == 1 && difPP > 0){
        this.diasMora = Moment().diff(fechaPP,'days');
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
      // console.log("TPF====",this.totalPagarFinal)
            // if(this.solicitud.estatusIntereses == 1 && this.diasMora > 0){
              if(this.diasMora > 0){
                let dmp
                this.pagos.forEach((element,index) => {
                  let im =0
                  let endOfMonth = Moment(element.fechaPago).endOf('month').format('DD');
                  dmp =  Moment().diff(element.fechaPago,'days')
                    if(dmp<1){
                      dmp = 0;  
                    }else if(dmp>endOfMonth){
                      dmp = endOfMonth
                    }
                    if(dmp>0 && element.estatusPago =="pendiente"){
                      
                      if(this.solicitud.tipoCredito=="d"){
                        im = montoInvertido*Math.pow((1+this.interesMoratorio),dmp);
                        // console.log("im=> ", im)
                        // this.pagos[index]['interesMora'] = Math.round(im- montoInvertido)+element.interesMoraPendiente;
                        this.interesMora = this.interesMora+this.pagos[index]['interesMora'];
                      }else{
                        im = element.saldoInicial*Math.pow((1+this.interesMoratorio),dmp);
                        // console.log("im=> ", im)
                        this.pagos[index]['interesMora'] = Math.round(im- element.saldoInicial)+element.interesesMoraPendiente;
                        this.interesMora = this.interesMora+this.pagos[index]['interesMora'];
                      }
                      
                      
                      // this.cuotaTotal = this.cuotaTotal + parseFloat(element.montoPagar)+parseFloat(element.interesMora)+parseFloat(element.gastosCobranza)
                      // this.pagos[index]['intereses'] = Math.round(im- montoInvertido);
                    }
                    // let im = montoInvertido*Math.pow((1+this.interesMoratorio),this.diasMora);
                    // this.interesMora = Math.round(im- montoInvertido);
                });
                
              
              }
      if(this.interesMora > 0){
        // this.totalPagar = this.totalPagar+this.interesMora
        // if(this.solicitud.tipoCredito == "m"){
        //   this.cuotaTotal = this.cuotaTotal+this.interesMora
        // }
        // this.formInteres.controls["interesMora"].setValue(this.interesMora);
      }

//cobranza
      // if(this.solicitud.estatusIntereses == 1 && this.diasMora > 0){
        if(this.diasMora > 0){
          let dmp
        if(this.solicitud.tipoCredito == 'm'){
          this.pagos.forEach((element,index) => {
            let endOfMonth = Moment(element.fechaPago).endOf('month').format('DD');
          dmp =  Moment().diff(element.fechaPago,'days')
            if(dmp<1){
              dmp = 0;  
            }else if(dmp>endOfMonth){
              dmp = endOfMonth
            }
            if(dmp>0 && element.estatusPago =="pendiente" && element.fechaPagado ==null){
          
              let gc = (this.cuota*30)/100;
              // this.gastosCobranzaSinIva = gc
              let ivagc = (gc*19)/100;
              // this.ivaGastosCobranza = ivagc
              let gct = gc+ivagc;
              if(dmp < 30){
                // this.pagos[index]['gastosCobranzaSinIva'] = Math.round((gc/30)*dmp)+element.gastosCobranzaSinIvaPendiente
                // this.pagos[index]['ivaGastosCobranza'] = Math.round((ivagc/30)*dmp)+element.ivaGastosCobranzaPendiente
                // this.pagos[index]['gastosCobranza'] = Math.round((gct/30)*dmp)+element.gastosCobranzaPendiente
                // this.pagos[index]['ivaGastosCobranza'] = Math.round((ivagc/30)*dmp)
                // this.gastosCobranzaSinIva = Math.round((this.gastosCobranzaSinIva/30)*dmp)
                // this.ivaGastosCobranza = Math.round((this.ivaGastosCobranza/30)*dmp)
                // this.gastosCobranza = this.gastosCobranza+this.pagos[index]['gastosCobranza'];
              }else{
                // this.pagos[index]['gastosCobranzaSinIva'] = Math.round(gc)+element.gastosCobranzaSinIvaPendiente
                // this.pagos[index]['ivaGastosCobranza'] = Math.round(ivagc)+element.ivaGastosCobranzaPendiente
                // this.pagos[index]['gastosCobranza'] = Math.round(gct)+element.gastosCobranzaPendiente
                // this.pagos[index]['ivaGastosCobranza'] = Math.round((ivagc/30)*dmp)
                // this.gastosCobranzaSinIva = Math.round((this.gastosCobranzaSinIva/30)*dmp)
                // this.ivaGastosCobranza = Math.round((this.ivaGastosCobranza/30)*dmp)
                // this.gastosCobranza = this.gastosCobranza+this.pagos[index]['gastosCobranza'];
              }
            }
          });
          // console.log("dias de mora", this.diasMora)
          // console.log("cuota",this.cuota)
          // console.log("gastos",gc)
          // console.log("iva gastos",ivagc)
          // console.log(this.gastosCobranza)
          // this.totalPagar = this.totalPagar+this.gastosCobranza;
          // this.cuotaTotal =this.cuotaTotal+this.gastosCobranza;
        }else{
          let gc = (this.totalPagar*30)/100;
          // this.gastosCobranzaSinIva = gc
          let ivagc = (gc*19)/100;
          // this.ivaGastosCobranza = ivagc
          // this.gastosCobranza = gc+ivagc;
          if(this.diasMora < 60){
            // this.gastosCobranzaSinIva = Math.round((this.gastosCobranzaSinIva/60)*this.diasMora)+this.pagoProximo.gastosCobranzaSinIvaPendiente
            // this.ivaGastosCobranza = Math.round((this.ivaGastosCobranza/60)*this.diasMora)+this.pagoProximo.ivaGastosCobranzaPendiente
            // this.gastosCobranza = Math.round((this.gastosCobranza/60)*this.diasMora)+this.pagoProximo.gastosCobranzaPendiente;
          }
          this.pagos.forEach((element,index) => {
            if(element.estatusPago =="pendiente" && (element.fechaPagado ==null || element.fechaPagado =="")){
              // this.pagos[index]['gastosCobranzaSinIva'] = Math.round(this.gastosCobranzaSinIva)+element.gastosCobranzaSinIvaPendiente
              // this.pagos[index]['ivaGastosCobranza'] = Math.round(this.ivaGastosCobranza)+element.ivaGastosCobranzaPendiente
              // this.pagos[index]['gastosCobranza'] = Math.round(this.gastosCobranza)+element.gastosCobranzaPendiente
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
        
      }
      // if(this.solicitud.estatus_credito == 'castigado'){
      //   this.totalPagarFinalParcial = Math.round(this.totalPagarFinal+this.pagos_parciales.interesesMora+this.pagos_parciales.gastosCobranza)
      // }
      // this.totalPagarFinalParcial = Math.round(this.totalPagarFinal+this.interesMora+this.gastosCobranza)
      this.saldoVencimiento = this.totalPagar-this.pagado
      this.totalPagar = this.totalPagar-this.pagado
      // if(this.solicitud.estatus_credito == 'castigado'){
      //   this.totalPagarParcial = this.totalPagarFinalParcial-this.pagos_parciales.totalNoPago;
      // }
      
      if(this.solicitud.tipoCredito == 'm' ){
        // if(this.diasMora == 0){
          // this.obtenerMonto(montoInvertido, this.solicitud.plazo);
        // }else{
          // this.saldoDia = Math.round(this.totalPagar+this.interesMora+this.gastosCobranza);
        // }
      }else{
        if(this.diasMora == 0){
          // this.obtenerMonto2(montoInvertido, this.diasVanCredito);
        }else{
          // this.saldoDia = Math.round(this.totalPagar+this.interesMora+this.gastosCobranza);
        }
      }

      // if(this.interesMora > 0 && this.gastosCobranza > 0){
        // this.pagoProximo.interesMora = this.interesMora;
        // this.pagoProximo.gastosCobranza =this.gastosCobranza;
        let p= 0
        let dmp
        this.pagos.forEach((element,index) => {
          // if(element.id == this.pagoProximo.id){
            // this.pagos[index].interesMora = this.interesMora;
            // this.pagos[index].gastosCobranza = this.gastosCobranza;
          // }
          let endOfMonth = Moment(element.fechaPago).endOf('month').format('DD');
          dmp =  Moment().diff(element.fechaPago,'days')
            if(dmp<1){
              dmp = 0;  
            }else if(dmp>endOfMonth){
              dmp = endOfMonth
            }
            if(dmp>0 && element.estatusPago =="pendiente"){
              this.cuotaTotal = this.cuotaTotal + parseFloat(element.montoPagar)+parseFloat(element.interesMora)+parseFloat(element.gastosCobranza)
              // this.pagos[index]['diasMora'] = dmp;
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
            p = p-parseInt(element.montoPagado);
          }else{
            p = this.totalPagarSuma-parseInt(element.montoPagado);
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
              // console.log('pendinete',p)
            }else{
              this.pagos[index]['pendientePagar'] = 0;
            }
            
          }else{
            this.pagos[index]['pendientePagar'] = 0;
          }
          
          
          
        });
        
        // this.actualizarIntereses();
      // }
      // if(this.solicitud.tipoCredito == 'd'){
      //   if(this.diasMora>0){
      //     this.monto_pagar(Math.round(this.saldoDia).toString());
      //   }else{
      //     this.monto_pagar(this.pagoProximo.montoPagar.toString());
      //   }
      // }else{
      //   let montoPa = this.pagoProximo.montoPagar+this.pagoProximo.interesMora+this.pagoProximo.gastosCobranza;
      //   this.monto_pagar(montoPa.toString());
      // }
      // this.monto_total_pagar(this.pagoProximo.montoPagar.toString());
      // this.monto_intereses_re(this.interesMora.toString());
      // this.monto_gastos(this.gastosCobranza.toString());
      
    },(error)=>{
      console.log(error)
    })
  }
  actualizarIntereses(){
    this.countriesService.updatePagoIntereses(this.formInteres.value).subscribe(res =>{
      // console.log(res);
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
      let interesesAct = 0
      this.t_interes = monto *( (tasa * Math.pow(1 + tasa, cuotas)) / (Math.pow(1 + tasa, cuotas) - 1) );
      
      this.getAmortizacion(tasa,montoS,plazo);
      this.pagos.forEach((element,index) => {
        dvc =  Moment().diff(element.fechaPago,'days')
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
        interesesAct = (parseInt(element.intereses)/30)*dvc
        sumIntereses = sumIntereses+interesesAct
      });
      this.t_interes_al_dia = sumIntereses;
      // if(this.cuotasPagadas>0){
      //   this.t_interes_al_dia = (interesMensual)*this.diasVanCreditoUltimoPago
      // }else{
      //   this.t_interes_al_dia = (interesMensual)*this.diasVanCredito
      // }
      // console.log('tasasas',this.t_interes_al_dia )
      // console.log('diasaaaa',this.diasVanCreditoUltimoPago )
      // console.log('cuotasPagadas',this.cuotasPagadas )
      // this.t_interes_al_dia = (this.taxInTotal/plazoInicialDias)*this.diasVanCredito
      if(montoS<=1200000){
        this.ap_express=parseFloat(montoS)*porExpUno/100;
        // this.iva=(parseFloat(this.plataforma)+parseFloat(this.ap_express))*19/100;
        this.plataforma=parseFloat(this.plataforma)*parseFloat(plazo)
        this.plataforma_al_dia = (parseFloat(this.plataforma)/plazoInicialDias)*this.diasVanCredito
        this.iva=(parseFloat(this.plataforma)+parseFloat(this.ap_express))*porIva/100;
        this.iva_al_dia=(this.plataforma_al_dia+parseFloat(this.ap_express))*porIva/100;
        this.total=parseFloat(this.subtotal)+parseFloat(this.plataforma)+parseFloat(this.ap_express)+parseFloat(this.iva)
        this.cuotaMensual=Math.round(parseFloat(this.total)/parseFloat(plazo))
        this.saldoDia = parseFloat(montoS)+this.t_interes_al_dia+this.plataforma_al_dia+parseFloat(this.ap_express)+this.iva_al_dia+this.interesMora+this.gastosCobranza;
        
      }else
      if(montoS>1200000 && montoS<=1700000){
        this.ap_express=parseFloat(montoS)*porExpDos/100;
        // this.iva=(parseFloat(this.plataforma)+parseFloat(this.ap_express))*19/100;

        this.plataforma=parseFloat(this.plataforma)*parseFloat(plazo)
        this.plataforma_al_dia = (parseFloat(this.plataforma)/plazoInicialDias)*this.diasVanCredito
        this.iva=(parseFloat(this.plataforma)+parseFloat(this.ap_express))*porIva/100;
        this.iva_al_dia=(this.plataforma_al_dia+parseFloat(this.ap_express))*porIva/100;
        this.total=parseFloat(this.subtotal)+parseFloat(this.plataforma)+parseFloat(this.ap_express)+parseFloat(this.iva)
        this.cuotaMensual=Math.round(parseFloat(this.total)/parseFloat(plazo))
        this.saldoDia = parseFloat(montoS)+this.t_interes_al_dia+this.plataforma_al_dia+parseFloat(this.ap_express)+this.iva_al_dia+this.interesMora+this.gastosCobranza;        
        
      }else
      if(montoS>=1700001){
        this.ap_express=parseFloat(montoS)*porExpTres/100;
        // this.iva=(parseFloat(this.plataforma)+parseFloat(this.ap_express))*19/100;
        this.plataforma=parseFloat(this.plataforma)*parseFloat(plazo)
        this.plataforma_al_dia = (parseFloat(this.plataforma)/plazoInicialDias)*this.diasVanCredito
        let plata=parseFloat(this.plataforma)*parseFloat(plazo);
        this.iva=(parseFloat(this.plataforma)+parseFloat(this.ap_express))*porIva/100;
        this.iva_al_dia=(this.plataforma_al_dia+parseFloat(this.ap_express))*porIva/100;
        this.total=parseFloat(this.subtotal)+parseFloat(this.plataforma)+parseFloat(this.ap_express)+parseFloat(this.iva)
        this.cuotaMensual=Math.round(parseFloat(this.total)/parseFloat(plazo))
        this.saldoDia = parseFloat(montoS)+this.t_interes_al_dia+this.plataforma_al_dia+parseFloat(this.ap_express)+this.iva_al_dia+this.interesMora+this.gastosCobranza;        
        
      }
      this.saldoDia = this.saldoDia - this.pagado
      // console.log(plazoInicialDias)
      // console.log(montoS)
      // console.log(this.t_interes_al_dia)
      // console.log(this.plataforma_al_dia)
      // console.log(this.ap_express)
      // console.log(this.iva_al_dia)
      // console.log(this.saldoDia)
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
  this.saldoDia= Math.round(this.totalDias)+this.interesMora+this.gastosCobranza;
}

detalleDesembolso(id){
  let data = {id:id};
  this.countriesService.showDesembolso(data).subscribe((res)=>{
    let r = JSON.parse(JSON.stringify(res)).desembolso;
    let comentario = r.comentario != null ? r.comentario : '';
    let text= '<div class="row"><div class="col-md-6 col-md-offset-3" style="margin:auto; text-align:left !important;"><label>Nombres y Apellidos: </label><span>'+r.nombres+'</span><br><label>Nº cedula: </label><span>'+r.ncedula+'</span><br><label>Email: </label><span>'+r.email+'</span><br><label>Nombre del banco: </label><span>'+r.nombreBanco+'</span><br><label>Tipo de cuenta: </label><span>'+r.tipoCuenta+'</span><br><label>Nº de cuenta: </label><span>'+r.ncuenta+'</span><br><label>Monto a transferir: </label><span>'+formatCurrency(r.monto, 'en-US', getCurrencySymbol('USD', 'wide'))+'</span><br><label>Metodo de desembolso: </label><span>'+r.metodo+'</span><br><label>Comentario: </label><span>'+comentario+'</span><br><label>Usuario que registro el desembolso: </label><span>'+r.registrador+'</span></div></div>'; 
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
      console.log(this.form.value)
      let concepto = this.form.get('concepto').value;
      let formData:FormData = new FormData();
      formData.append('idPago',this.form.get('idPago').value);
      formData.append('montoPagado',this.form.get('montoPagado').value);
      formData.append('medioPago',this.form.get('medioPago').value);
      formData.append('fechaPagado',this.form.get('fechaPagado').value);
      formData.append('nroReferencia',this.form.get('nroReferencia').value);
      formData.append('interesMora',this.form.get('interesMora').value);
      formData.append('gastosCobranza',this.form.get('gastosCobranza').value);
      formData.append('idSolicitud',this.form.get('idSolicitud').value);
      formData.append('concepto',this.form.get('concepto').value);
      formData.append('factura', (this.factura != null ? this.factura : ''));
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
  var fecha = event.year+'-'+event.month+'-'+event.day;
  this.form.controls['fechaPagado'].setValue(Moment(fecha).format("YYYY-MM-DD"));

}
monto_pagar(value: string) {
  // ing_mensuales
  this.form.controls["montoPagado"].setValue(value);
  console.log(value)
  let val = parseInt(value, 10);
  if (Number.isNaN(val)) {
    val = 0;
  }
  this.montoP = formatCurrency(val, 'en-US', getCurrencySymbol('USD', 'wide'));
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
    console.log(this.formPagoParcial.value);
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
        console.log(this.form.value)

        this.countriesService.createPagoParcial(this.formPagoParcial.value).subscribe(response => {
          if (response) {
            this.toast.success("Pago realizado con exito");
            this.formPagoParcial.reset();
            this.modalService.dismissAll();
            this.router.navigate(['/admin/abiertos']);

          } else {
            this.toast.error("Error inesperado!");
          }
        });
      }
    });
  }
  enviarFactura(){
    console.log(this.form.value);
    const confirm = swal.fire({
      title: `Cargar Factura`,
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
        console.log(this.form.value)
        let formData:FormData = new FormData();
        formData.append('idSolicitud',this.idSolicitud);
        formData.append('factura', (this.factura != null ? this.factura : ''));
        this.countriesService.cargarFactura(formData).subscribe(response => {
          if (response) {
            this.toast.success("Factura Guardada");
            this.form.reset();
            this.modalService.dismissAll();
            this.detalleCredito(this.idSolicitud);
            
          } else {
            this.toast.error("Error inesperado!");
          }
        });
      }
    });
  }
}
