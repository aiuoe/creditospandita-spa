import { Component, OnInit } from '@angular/core';
import { MorososService } from 'app/shared/services/morosos.service';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData, formatNumber } from '@angular/common';
import * as Moment from 'moment';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConfigCalculadoraService } from 'app/shared/services/config-calculadora.service';
@Component({
  selector: 'app-morosos',
  templateUrl: './morosos.component.html',
  styleUrls: ['./morosos.component.scss']
})



export class MorososComponent implements OnInit {

  constructor(
    private morososService: MorososService, 
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toast: ToastrService,
    private config: ConfigCalculadoraService,
    ) { }
  
  isCollapsed = false;
  records: any[] = [];
  p: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 5;
  hastaMora ='';
  desdeMora='';
  filterParams: any;
  interesMoratorio = Math.pow(1+(22/100), (1/360))-1;
  usuario: any;

  validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  validation_messages = {
    /* 'identity_document_number': [
      { type: 'required', message: 'Ingrese su nro. de identificación.' },
      { type: 'maxlength', message: 'No debe ser mayor a 11 caracteres.' },
      { type: 'pattern', message: 'El campo debe contener solo números' },
     ], */
   /*  'email': [
     { type: 'required', message: 'Ingrese un correo electronico.' },
     { type: 'email', message: 'Ingrese un correo electronico válido.' },
    ], */
    /* 'telephone': [
     { type: 'required', message: 'Ingrese su número de teléfono.' },
     { type: 'pattern', message: 'El campo debe contener solo números' },
     { type: 'maxlength', message: 'No debe ser mayor a 12 caracteres.' },
    ], */
    'proposito': [
     { type: 'required', message: 'Este campo es obligatorio.' },
    ],
    'fechaContacto': [
     { type: 'required', message: 'Este campo es obligatorio.' },
    ],
    'metodoContacto': [
     { type: 'required', message: 'Este campo es obligatorio.' },
    ],
    'resultado': [
     { type: 'required', message: 'Este campo es obligatorio.' },
    ],
    'fechaPtp': [
     { type: 'required', message: 'Este campo es obligatorio.' },
    ],
    'montoPtp': [
     { type: 'required', message: 'Este campo es obligatorio.' },
     { type: 'pattern', message: 'Este campo debe contener solo números' },
    ],
    'comentario': [
     { type: 'required', message: 'Este campo es obligatorio.' },
    ],
    
  };

  userContact: any;
  historyContact: any;
  external_solicitud_id: number;
  external: boolean = false;
  expandR: boolean = false;
  expandL: boolean = false;

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

  ngOnInit() {
    this.usuario= JSON.parse(localStorage.getItem('user'))
    registerLocaleData(localeEs, 'es');
    this.validations();
    this.configDias()
    this.configMeses()
  }

  getRecords(params){
    this.morososService.getMorosos(params).subscribe(res => {
      this.records = res['data'];
      this.records.forEach( record => {
        let montoInvertido =0
        let totalPagar =0
        if (this.userContact) {
          if (record.id == this.userContact.id) {
            this.userContact = record;
          }
        }
        if(record.ofertaEnviada == 2){
          montoInvertido = parseInt(record.montoSolicitado)
          totalPagar= parseInt(record.totalPagar)
        }else{
          montoInvertido = parseInt(record.ContraOferta.montoAprobado)
          totalPagar= parseInt(record.ContraOferta.totalPagar)
        }
        let dvc
        let diasVanCredito =0
      if(record.tipoCredito == 'd'){

        if(record.estatus_credito == "novado"){
            dvc = Moment().diff(record.fechaNovado,'days')
        }else{
            dvc = Moment().diff(record.fechaDesembolso,'days')
        }

      }
      if(dvc<=0){
        diasVanCredito = 1;
      }else{
        diasVanCredito = dvc;
      }
        record['cuotaTotalMora'] = this.getTotalCuota(record.pagos); 
        record['pendientePagarMora'] = this.getPendientePagar(record.pagos, record.tipoCredito, record.ProximoPago);     
        if(record.tipoCredito == 'm' ){
          record['saldoDia']=this.obtenerMonto(montoInvertido, record.plazo, record.pagos);
        }else{
          if(record.diasMora == 0){
            // console.log("SD",this.pagos.length)
            record['saldoDia']= this.obtenerMonto2(montoInvertido, diasVanCredito,record.pagos);
          }else{
            if(record.pagos.length > 1){
              let j = record.pagos.length-1
              record['saldoDia'] = record.pagos[j].montoPagar
            }else{
              record['saldoDia'] = Math.round(totalPagar+record.pagos[0].interesMora+record.pagos[0].gastosCobranza);
            }
          }
        }
      });
      console.log(this.records);
      
      this.totalItems = res['total'];
    }, (err) =>{
      console.log(err);
    });
    
  }

  perPage(itemsPerPage,page){
    this.p = page;
    this.itemsPerPage = itemsPerPage;
    let param = {
      page:this.p,
      per_page:this.itemsPerPage,
      desdeMora:this.desdeMora,
      hastaMora:this.hastaMora
    };
    this.getRecords(param);
  }

  onFilter(filterParams) {
    this.filterParams = filterParams
    this.p=1

    let params = {
      page: 1,
      per_page: this.itemsPerPage,
      desdeMora: this.desdeMora,
      hastaMora: this.hastaMora, 
      ...filterParams
    }
    this.getRecords(params);
  }

  getTotalCuota(pagos){

    let cuotaTotal = 0;
    pagos.forEach((element,index) => {
          
      let dmp;
      let endOfMonth = Moment(element.fechaPago).endOf('month').format('DD');
     
      dmp =  Moment().diff(element.fechaPago,'days')
     
      if(dmp<1){
        dmp = 0;  
      }else if(dmp>endOfMonth){
        dmp = endOfMonth
      }
      if(dmp>0 && element.estatusPago =="pendiente"){
        cuotaTotal = cuotaTotal + parseFloat(element.montoPagar)+parseFloat(element.interesMora)+parseFloat(element.gastosCobranza)
        pagos[index]['diasMora'] = dmp;
      }
      
      pagos[index].montoPagar = parseFloat(element.montoPagar)+parseFloat(element.interesMora)+parseFloat(element.gastosCobranza)

    });

    return cuotaTotal;
  }

  getPendientePagar(pagos, tipoCredito, pagoProximo){
    let pendientePagar = 0
    let p = 0;
    let totalPagarSuma = 0;
    let interesMora = 0;
    let dmp;
    let cuota = 0;
   
    pagos.forEach((element,index) => {
      
      // pagos[index].montoPagar = parseFloat(element.montoPagar)+parseFloat(element.interesMora)+parseFloat(element.gastosCobranza)
      totalPagarSuma = totalPagarSuma + pagos[index].montoPagar
      interesMora = interesMora+parseFloat(element.interesMoraPendiente)
      dmp =  Moment().diff(element.fechaPago,'days')
    
      // pagos.montoPagar = parseFloat(element.montoPagar)+parseFloat(element.interesMora)+parseFloat(element.gastosCobranza)
      // totalPagarSuma = totalPagarSuma + pagos.montoPagar
      // console.log('MONTO A PAGAR '+ pagos.montoPagar);
      
    });
    pagos.forEach((element,index) => {
      
      if(p>0){
        p = p-parseFloat(element.montoPagado);
        
      }else{
        p = totalPagarSuma-parseFloat(element.montoPagado);
        
      }
      if(element.estatusPago == 'pagado'){
        if(p>=0){
          if(element.concepto == "Pago anticipado"){
            pagos.pendientePagar = 0;
          }else{
            pagos.pendientePagar = p;
            pendientePagar = p;
            // console.log('pendinete',p)
          }
        }else{
          pagos.pendientePagar = 0;
        }
        
      }
      
      
    });
    return pendientePagar;
  }

  openHistory(content, user?){
    if (user) { 
      this.userContact = user;
    }
    console.log(this.userContact.idUserFk);
    
    this.modalService.open(content, {centered: true, size: 'lg', backdrop: 'static'}).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  validations(){
    this.validations_form = this.formBuilder.group({
      proposito: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      fechaContacto: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      metodoContacto: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      resultado: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      fechaPtp: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      montoPtp: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(/^([0-9])*$/)
      ])),
      comentario: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    });

  }

  registerHistory(form){
    form['idSolicitudFk'] = this.userContact.id_solicitud;
    form['idUserFk'] = this.userContact.idUserFk;
    form['colaborador_id'] = this.usuario.id;

    this.morososService.storeHistoryContact(form).subscribe(
      res => {
        this.toast.success(res);
        this.validations();
        this.perPage(this.itemsPerPage, this.p);
      }, 
      err => {
        console.log(err);
      }
    );
    
  }

  setExternalSolicitudId(id){
    
    this.external = false;
    let sidebar = document.getElementById('menu23');
    let fondo = document.getElementById('fondo');
    fondo.classList.remove('main-content');
    sidebar.style.display = 'none';
    setTimeout(() => {
      this.external_solicitud_id = id;
      this.external = true;
    }, 100);
  }

  closeExternal(param){
    let sidebar = document.getElementById('menu23');
    sidebar.style.display = 'block';
    let fondo = document.getElementById('fondo');
    fondo.classList.add('main-content');
    this.external = param;
    this.expandR = param;
    this.expandL = param;
  }

  expandPanel(param){
    this.expandR = !this.expandR;
  }

  expandLeftPanel(){
    this.expandL = !this.expandL;
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
  
  obtenerMonto(montoS,plazo,pagos){
    let porPlat = this.porplataformaMeses > 0 ? this.porplataformaMeses : 4;
    let porIva = this.porIvaMeses > 0 ? this.porIvaMeses : 19;
    let tasa = this.tasaMeses > 0 ? this.tasaMeses : 0.01916667;
    let porExpUno = this.porExpressMeses > 0 ? this.porExpressMeses : 30;
    let porExpDos = this.porExpressDosMeses > 0 ? this.porExpressDosMeses : 27.5;
    let porExpTres = this.porExpressTresMeses > 0 ? this.porExpressTresMeses : 25;
    let saldoDia =0
    this.montoSolicitado=montoS;
    this.plataforma=parseFloat(montoS)*(porPlat/100);
    let plazoInicialDias = parseInt(plazo)*30
      let cuotas=plazo;
      let monto=montoS;

      let dvc
      let sumIntereses = 0
      let sumInteresesPendientes = 0
      let interesesAct = 0
      let sumdvc = 0
      let sumdvcp = 0
      let interesMora = 0
      let gastosCobranza =0
      let suma_gastosCobranzaSinIva =0 
      let suma_ivaGastosCobranza =0
      let suma_interesMora =0
      let pagado_todo =0
      this.t_interes = monto *( (tasa * Math.pow(1 + tasa, cuotas)) / (Math.pow(1 + tasa, cuotas) - 1) );
      
      this.getAmortizacion(tasa,montoS,plazo);
      pagos.forEach((element,index) => {
        let mesantes = Moment(element.fechaPago).subtract(1, 'months').format('YYYY-MM-DD');
        
          dvc =  Moment().diff(mesantes,'days')
        
        
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
          gastosCobranza =gastosCobranza +element.gastosCobranza
          interesMora = interesMora+element.interesMora
        }else{
          pagado_todo = pagado_todo+element.montoPagado
          suma_gastosCobranzaSinIva = suma_gastosCobranzaSinIva+element.gastosCobranzaSinIva
          suma_ivaGastosCobranza = suma_ivaGastosCobranza+element.ivaGastosCobranza
          suma_interesMora = suma_interesMora+element.interesMora
        }
      });
      this.t_interes_al_dia = Math.ceil(sumIntereses);

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
        saldoDia = parseFloat(montoS)+this.t_interes_al_dia+this.plataforma_al_dia+parseFloat(this.ap_express)+this.iva_al_dia+interesMora+gastosCobranza;
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
        saldoDia = parseFloat(montoS)+this.t_interes_al_dia+this.plataforma_al_dia+parseFloat(this.ap_express)+this.iva_al_dia+interesMora+gastosCobranza;        
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
        saldoDia = parseFloat(montoS)+this.t_interes_al_dia+this.plataforma_al_dia+parseFloat(this.ap_express)+this.iva_al_dia+interesMora+gastosCobranza;
        // this.saldoDia = parseFloat(montoS)+this.t_interes_al_dia+this.plataforma_al_dia+parseFloat(this.ap_express)+this.iva_al_dia;        
        
      }
      let sumamora = suma_gastosCobranzaSinIva+suma_ivaGastosCobranza+suma_interesMora
      let pago = pagado_todo-sumamora   

      // console.log("SD",this.saldoDia)
      // console.log("pagado",this.pagado)
      // console.log("paga",pago)
      saldoDia = saldoDia - pago
      // console.log(plazoInicialDias)
      // console.log(montoS)
      // console.log("PLA",this.plataforma)
      // console.log("TSA",this.t_interes_al_dia)
      // console.log("PLAD",this.plataforma_al_dia)
      // console.log("AP",this.ap_express)
      // console.log("IVA",this.iva_al_dia)
      // console.log(this.saldoDia)
      return saldoDia;
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
obtenerMonto2(montoS,plazo, pagos){
  let porPlat = this.porplataformaDias > 0 ? this.porplataformaDias : 1000;
  let porIva = this.porIvaDias > 0 ? this.porIvaDias : 19;
  let tasa = this.tasaDias > 0 ? this.tasaDias : 14;
  let porExp = this.porExpressDias > 0 ? this.porExpressDias : 12.5;
  let saldoDia =0
  let interesMora
  let gastosCobranza =0
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
  pagos.forEach((element,index) => {
    if(element.estatusPago == "pendiente"){
      gastosCobranza =gastosCobranza +element.gastosCobranza
      interesMora = interesMora+element.interesMora
    }
  })
  saldoDia= Math.round(this.totalDias)+interesMora+gastosCobranza;
  return saldoDia;
}
}
