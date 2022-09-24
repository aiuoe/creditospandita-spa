import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { CountryService } from '../../shared/services/country.service';
import { state, trigger, transition, animate, style } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import * as Moment from 'moment';
import {formatCurrency, getCurrencySymbol} from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { registerLocaleData, formatNumber } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { AuthService } from '../../shared/auth/auth.service';
@Component({
  selector: 'app-admin-credit',
  templateUrl: './admin-credit.component.html',
  styleUrls: ['./admin-credit.component.scss'],
  animations: [
    trigger('openClose', [
                state('open', style({height: '100%', opacity: 1})),
                state('closed', style({height: 0, opacity: 0})),
                transition('* => *', [animate('100ms')])
            ]),
 ]
})
export class AdminCreditComponent implements OnInit {
 p;
itemsPerPage = '5';
isOpen = true;
creditos;
  form: FormGroup;
  creditoAprobado=[];
  country$:Observable<any[]>;
  aprobados$: Observable<any[]>;
  usuario
  contraOfertaForm: FormGroup;
  tablaContraOferta
  interesMoratorio = Math.pow(1+(22/100), (1/360))-1
  idSolicitud
  solicitud
  fechaPago
  cuota=0
  pagado =0
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
  pagoProximo;
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
conceptoNovacion = false
totalConceptoNovacion =0
  cuotaTotal: any;
  totalPagarFinal: number;
  repagos: any;
  pagado_todo: any;
  pagado_novacion: any;
  montoPT: any;
toggle() {
  this.isOpen = !this.isOpen;
}
  constructor(
    private toast: ToastrService,
    private countriesService: CountryService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,

    ) {
      this.form = this.fb.group({
        id: [''],
        fecha_desembolso: [''],
        fecha_pago: [''],
        documento: [''],
        nombres: [''],
        telefono: [''],
        correo: [''],
        direccion: [''],
        monto_aprobado: [''],
        plataforma: [''],
        interes: [''],
        interes_mora: [0],
        aprobacion_express:[''],
        cobranza:[''],
        iva:[''],
        total:[''],

      })
    }
 
  ngOnInit() {
    registerLocaleData(localeEs, 'es');
    this.activatedRoute.params.subscribe((params)=>{
      if(params['id']){
        this.idSolicitud = params['id']
        // console.log("ids",params)
        this.detalleCredito(params['id'])
        if(params['novacion']){
          this.conceptoNovacion =true;
        }
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
    // this.formInteres.controls["gastosCobranza"].setValue(0);
    // this.formInteres.controls["interesMora"].setValue(0);
    let data = {
      'id':id
    }
    this.countriesService.showCreditoActivo(data).subscribe((res)=>{
      let fechaAct = Moment().format('YYYY-MM-DD');
      let diaAct = Moment().format('DD');
      let mesAct = Moment().format('MM');
      let anoAct = Moment().format('YYYY');
      this.solicitud = JSON.parse(JSON.stringify(res)).solicitud
      this.contra_oferta = JSON.parse(JSON.stringify(res)).contra_oferta
      this.pagos = JSON.parse(JSON.stringify(res)).pagos
      this.repagos = JSON.parse(JSON.stringify(res)).repagos
      this.pagoProximo = JSON.parse(JSON.stringify(res)).pago_proximo
      this.pagado = JSON.parse(JSON.stringify(res)).pagado
      this.pagado_todo = JSON.parse(JSON.stringify(res)).pagado_todo
      this.pagado_novacion = JSON.parse(JSON.stringify(res)).pagado_novacion
      this.cuotasPagadas = JSON.parse(JSON.stringify(res)).coutas_pagadas
      let dvc
      if(this.conceptoNovacion || this.solicitud.estatus_credito == 'pendiente de novacion'){
        this.conceptoNovacion = true;
        this.cambioConcepto("Novacion");
      }
      if(this.solicitud.tipoCredito == 'm'){
        dvc = Moment().diff(this.solicitud.fechaDesembolso,'days')
      }else{
        if(this.solicitud.estatus_credito == "novado"){
          dvc = Moment().diff(this.solicitud.fechaNovado,'days')
        }else{
          dvc = Moment().diff(this.solicitud.fechaDesembolso,'days')
        }
      }
      console.log("van=>", dvc)
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
          this.cuotaTotal = Math.round(parseFloat(this.solicitud.totalPagar)/parseInt(this.solicitud.plazo));
        }else{
          this.cuota = Math.round(parseFloat(this.contra_oferta.totalPagar)/parseInt(this.solicitud.plazo));
          this.cuotaTotal = Math.round(parseFloat(this.contra_oferta.totalPagar)/parseInt(this.solicitud.plazo));
        }
        
        this.diasMesesVencimiento = parseInt(this.solicitud.plazo)-this.cuotasPagadas
      }else{
        this.fechaPago = this.pagoProximo.fechaPago;
        if(fechaAct < this.fechaPago){
          this.diasMesesVencimiento = Moment(this.pagoProximo.fechaPago).diff(fechaAct,'days')
        }else{
          this.diasMesesVencimiento = 0
        }
        
      }
      console.log("van=>", this.diasVanCredito)
      let fechaPP= Moment(this.pagoProximo.fechaPago).format("YYYY-MM-DD")
      let difPP = Moment().diff(fechaPP,'days')
      // console.log("DIF=> ", difPP);
      if(this.solicitud.estatusIntereses == 1 && difPP > 0){
        this.diasMora = Moment().diff(fechaPP,'days');
      }
      
      let montoInvertido = 0
      if(this.solicitud.ofertaEnviada == 2){
        montoInvertido = parseInt(this.solicitud.montoSolicitado)
        this.totalPagar= parseInt(this.solicitud.totalPagar)
        this.totalPagarFinal = parseInt(this.solicitud.totalPagar)
      }else{
        montoInvertido = parseInt(this.contra_oferta.montoAprobado)
        this.totalPagar = parseInt(this.contra_oferta.totalPagar)
        this.totalPagarFinal = parseInt(this.contra_oferta.totalPagar)
      }
      if(this.solicitud.estatusIntereses == 1 && this.diasMora > 0){
        let im = montoInvertido*Math.pow((1+this.interesMoratorio),this.diasMora);
        this.interesMora = Math.round(im- montoInvertido);
      console.log("im=> ", this.interesMora)
      }
      if(this.interesMora > 0){
        // this.totalPagar = this.totalPagar+this.interesMora
        if(this.solicitud.tipoCredito == "m"){
          this.cuotaTotal = this.cuotaTotal+this.interesMora
        }
        // this.formInteres.controls["interesMora"].setValue(this.interesMora);
      }

      //cobranza
      if(this.solicitud.estatusIntereses == 1 && this.diasMora > 0){
        if(this.solicitud.tipoCredito == 'm'){
          let gc = (this.cuota*30)/100;
          let ivagc = (gc*19)/100;
          this.gastosCobranza = gc+ivagc;
          if(this.diasMora < 30){
            this.gastosCobranza = Math.round((this.gastosCobranza/30)*this.diasMora);
          }
          console.log(gc)
          console.log(ivagc)
          console.log(this.gastosCobranza)
          // this.totalPagar = this.totalPagar+this.gastosCobranza;
          this.cuotaTotal =this.cuotaTotal+this.gastosCobranza;
        }else{
          let gc = (this.totalPagar*30)/100;
          let ivagc = (gc*19)/100;
          this.gastosCobranza = gc+ivagc;
          if(this.diasMora < 60){
            this.gastosCobranza = Math.round((this.gastosCobranza/60)*this.diasMora);
          }
          console.log("%%",this.totalPagar);
          console.log("%%",gc)
          console.log("%%",ivagc)
          console.log("Gastos",this.gastosCobranza)
          // this.totalPagar = this.totalPagar+this.gastosCobranza;
        }
        // this.formInteres.controls["gastosCobranza"].setValue(this.gastosCobranza);
        
      }

      this.saldoVencimiento = this.totalPagar-this.pagado
      this.totalPagar = this.totalPagar-this.pagado

      if(this.solicitud.tipoCredito == 'm' ){
        if(this.diasMora == 0){
          this.obtenerMonto(montoInvertido, this.solicitud.plazo);
        }else{
          this.saldoDia = Math.round(this.totalPagar+this.interesMora+this.gastosCobranza);
        }
      }else{
        if(this.diasMora == 0){
          this.obtenerMonto2(montoInvertido, this.diasVanCredito);
        }else{
          this.saldoDia = Math.round(this.totalPagar+this.interesMora+this.gastosCobranza);
        }
      }

      // if(this.interesMora > 0 && this.gastosCobranza > 0){
        this.pagoProximo.interesMora = this.interesMora;
        this.pagoProximo.gastosCobranza =this.gastosCobranza;
        this.pagos.forEach((element,index) => {
          if(element.id == this.pagoProximo.id){
            this.pagos[index].interesMora = this.interesMora;
            this.pagos[index].gastosCobranza = this.gastosCobranza;
          }
          
        });
        
        // this.actualizarIntereses();
      // }
      if(this.solicitud.tipoCredito == 'd'){
        if(this.diasMora>0){
          // this.monto_pagar(Math.round(this.saldoDia).toString());
          this.montoPT = this.saldoDia
        }else{
          // this.monto_pagar(this.pagoProximo.montoPagar.toString());
          this.montoPT = this.pagoProximo.montoPagar
        }
      }else{
        let montoPa = this.pagoProximo.montoPagar+this.pagoProximo.interesMora+this.pagoProximo.gastosCobranza;
        this.montoPT = this.cuotaTotal
        // this.monto_pagar(montoPa.toString());
      }
      // this.monto_total_pagar(this.pagoProximo.montoPagar.toString());
      // this.monto_intereses_re(this.interesMora.toString());
      // this.monto_gastos(this.gastosCobranza.toString());
      console.log("Monto=====",this.montoPT)
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
      this.t_interes = monto *( (tasa * Math.pow(1 + tasa, cuotas)) / (Math.pow(1 + tasa, cuotas) - 1) );
      
      this.getAmortizacion(tasa,montoS,plazo);
      this.t_interes_al_dia = (this.taxInTotal/plazoInicialDias)*this.diasVanCredito

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
      console.log(plazoInicialDias)
      console.log(montoS)
      console.log(this.t_interes_al_dia)
      console.log(this.plataforma_al_dia)
      console.log(this.ap_express)
      console.log(this.iva_al_dia)
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
  this.saldoDia= this.totalDias+this.interesMora+this.gastosCobranza;
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
    console.log(res);
  },(error)=>{
    console.log(error);
  })
}

exportPDF(){
 let param ={solicitud:this.solicitud,pagoProximo:this.pagoProximo,contraOferta:this.contra_oferta, montoPT:this.montoPT}
console.log(param);
  this.countriesService.exportConsignacion(this.idSolicitud);
}
cambioConcepto(event){
  console.log("concepto=>",event);
  if(event == "Novacion"){
    let mn = 0
    if(this.solicitud.ofertaEnviada == 2){
      mn = parseInt(this.solicitud.tasaInteres)+parseInt(this.solicitud.plataforma)+parseInt(this.solicitud.aprobacionRapida)+parseInt(this.solicitud.iva);
    }else{
      mn = parseInt(this.contra_oferta.tasaInteres)+parseInt(this.contra_oferta.plataforma)+parseInt(this.contra_oferta.aprobacionRapida)+parseInt(this.contra_oferta.iva);
    }
    // this.monto_pagar(mn.toString());
    this.totalConceptoNovacion =mn;
  }else if(event == "Pago total credito"){
    // this.monto_pagar(this.pagoProximo.montoPagar.toString());
  }else if(event == "Pago anticipado" || event=="Pago total saldo al dia moroso"){
    // this.monto_pagar(Math.round(this.saldoDia).toString());
  }else if(event == "Pago cuota mensual" || event=="Pago ultima cuota"){
    // this.monto_pagar(this.pagoProximo.montoPagar.toString());
  }else if(event == "Pago cuota mensual morosa"){
    // this.monto_pagar(this.cuotaTotal.toString());
  }else{
    let a = 0;
    // this.monto_pagar(a.toString());
  }

}

}
