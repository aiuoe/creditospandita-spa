import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import * as Moment from 'moment';
import {formatCurrency, getCurrencySymbol} from '@angular/common';
import { CountryService } from '../../shared/services/country.service';
import { RequestService } from 'app/shared/services/request.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { registerLocaleData, formatNumber } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { AuthService } from '../../shared/auth/auth.service';
import { ConfigCalculadoraService } from 'app/shared/services/config-calculadora.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-novacion',
  templateUrl: './novacion.component.html',
  styleUrls: ['./novacion.component.scss']
})
export class NovacionComponent implements OnInit {

  p=1;
  itemsPerPage = 5;
  currentJustify = 'fill';
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
  totalNovacion;
  fechaNovacion;
  checkTerminos=false
  checkSituacion=false

  public isCollapsed = true;
  closeResult: string;
  constructor(private modalService: NgbModal,
    private toast: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private countriesService: CountryService,
    private requestService: RequestService,
    private auth : AuthService,
    private config: ConfigCalculadoraService,) { }

  ngOnInit() {
    registerLocaleData(localeEs, 'es');
    this.activatedRoute.params.subscribe((params)=>{
      if(params['id']){
        this.idSolicitud = params['id']
        // console.log("ids",params)
        this.detalleCredito(params['id'])
      }
    })
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


  detalleCredito(id){
    let data = {
      'id':id
    }
    this.countriesService.showCreditoActivo(data).subscribe((res)=>{
      let fechaAct = Moment().format('YYYY-MM-DD');
      let diaAct = Moment().format('DD');
      let mesAct = Moment().format('MM');
      let anoAct = Moment().format('YYYY');
      this.solicitud = JSON.parse(JSON.stringify(res)).solicitud
      this.totalNovacion=parseFloat(JSON.parse(JSON.stringify(res)).contra_oferta.tasaInteres)+parseFloat(JSON.parse(JSON.stringify(res)).contra_oferta.plataforma)+parseFloat(JSON.parse(JSON.stringify(res)).contra_oferta.aprobacionRapida)+parseFloat(JSON.parse(JSON.stringify(res)).contra_oferta.iva)
      this.contra_oferta = JSON.parse(JSON.stringify(res)).contra_oferta
      this.pagos = JSON.parse(JSON.stringify(res)).pagos
      this.pagoProximo = JSON.parse(JSON.stringify(res)).pago_proximo
      this.pagado = JSON.parse(JSON.stringify(res)).pagado
      this.cuotasPagadas = JSON.parse(JSON.stringify(res)).coutas_pagadas
      
      this.diasVanCredito = Moment().diff(this.solicitud.fechaDesembolso,'days')
      if(this.solicitud.tipoCredito == 'm' ){
        this.fechaPago = Moment(this.solicitud.fechaDesembolso).add(this.solicitud.plazo, 'months').format('YYYY-MM-DD');
        this.cuota = Math.round(parseFloat(this.solicitud.totalPagar)/parseInt(this.solicitud.plazo));
        this.diasMesesVencimiento = parseInt(this.solicitud.plazo)-this.cuotasPagadas
      }else{
        this.fechaPago = Moment(this.solicitud.fechaDesembolso).add(this.solicitud.plazo, 'days').format('YYYY-MM-DD');
        this.fechaNovacion = Moment(fechaAct).add(this.solicitud.plazo, 'days').format('YYYY-MM-DD');
        console.log('nueva fecha',this.fechaNovacion)
        console.log('fecha actual',fechaAct)
        if(fechaAct < this.fechaPago){
          this.diasMesesVencimiento = Moment().diff(this.pagoProximo.fechaPago,'days')
        }else{
          this.diasMesesVencimiento = 0
        }
        
      }
      console.log("van=>", this.diasVanCredito)
      let fechaPP= Moment(this.pagoProximo.fechaPago).format("YYYY-MM-DD")
      let difPP = Moment().diff(fechaPP,'days')
      // console.log("DIF=> ", difPP);
      if(difPP > 0){
        this.diasMora = Moment().diff(fechaPP,'days');
      }
      
      let montoInvertido = 0
      if(this.solicitud.ofertaEnviada == 2){
        montoInvertido = parseInt(this.solicitud.montoSolicitado)
        this.totalPagar= parseInt(this.solicitud.totalPagar)
      }else{
        montoInvertido = parseInt(this.contra_oferta.montoAprobado)
        this.totalPagar = parseInt(this.contra_oferta.totalPagar)
      }
      if(this.diasMora > 0){
      let im = montoInvertido*Math.pow((1+this.interesMoratorio),this.diasMora);
      this.interesMora = im- montoInvertido;
      // console.log("im=> ", im)
      }
      if(this.interesMora > 0){
        this.totalPagar = this.totalPagar+this.interesMora
      }
      if(this.solicitud.tipoCredito == 'm' ){
        this.obtenerMonto(montoInvertido, this.solicitud.plazo);
      }else{
        this.obtenerMonto2(montoInvertido, this.diasVanCredito);
      }

      this.saldoVencimiento = this.totalPagar-this.pagado
      
      // console.log("interesMora",this.interesMora)
      //B2*(1+C3)^(C6)
      
      // console.log(this.solicitud)
    },(error)=>{
      console.log(error)
    })
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
        this.saldoDia = parseFloat(montoS)+this.t_interes_al_dia+this.plataforma_al_dia+parseFloat(this.ap_express)+this.iva_al_dia;
        
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
        this.saldoDia = parseFloat(montoS)+this.t_interes_al_dia+this.plataforma_al_dia+parseFloat(this.ap_express)+this.iva_al_dia;        
        
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
        this.saldoDia = parseFloat(montoS)+this.t_interes_al_dia+this.plataforma_al_dia+parseFloat(this.ap_express)+this.iva_al_dia;        
        
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
  this.saldoDia= this.totalDias;
}
  cambioTermino(event){
    console.log(event);
    this.checkTerminos = event;
  }
  cambioSituacion(event){
    console.log(event);
    this.checkSituacion = event;
  }
  cambioEstatus(solicitud){

    this.requestService.estatusNovacion(solicitud).subscribe((res)=>{
      console.log(res)

      this.router.navigate(['/admin-credit/', solicitud,1]); 
     
    },(error)=>{
      console.log(error)
      return false;
    })

  }

  cambioEstatus2(solicitud){

    this.requestService.estatusNovacion(solicitud).subscribe((res)=>{
      console.log(res)

      // this.router.navigate(['/admin-credit/', solicitud]); 
     
    },(error)=>{
      console.log(error)
      return false;
    })

  }
}
