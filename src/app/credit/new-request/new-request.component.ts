import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { registerLocaleData, formatNumber } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { RequestService } from 'app/shared/services/request.service';
import { ToastrService } from 'ngx-toastr';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import swal from 'sweetalert2';
import { Observable, from } from 'rxjs';
import { ConfigCalculadoraService } from 'app/shared/services/config-calculadora.service';
import { environment } from "../../../environments/environment";
@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.scss']
})
export class NewRequestComponent implements OnInit {
  rutaStorage = environment.apiBase+"/storage/app/public"
  closeResult: string;
  homeForm: FormGroup;
  homeFormDias: FormGroup;
  montoSolicitado;
  plazoMeses=2;
  plazoSolicitado;
  montoSolicitado2;
  plazoSolicitado2;
  usoPlataforma;
  aprobacionExpress;
  taxInTotal;
  valorCupon
codigoDescuento=0;
  plataforma ;
  ap_express;
  iva ;
  t_interes;
  subtotal;
  total;
   cant_mensual=2;

  montoSolicitadoDias:any = 175000;
  plazoDias:any = 15;
  plataformaDias:any ;
  ap_expressDias:any;
  ivaDias:any;
  t_interesDias:any;
  subtotalDias:any;
  totalDias:any;
  cant_dias:any = 15;
  cuotaMensual:any;
  desahabilitado=false;
  range=2;
  cualMostrar=1;
  submittedM = false
  submittedD = false
  userLog
  txt = "<p style='text-align:left; font-size:14px;'><p style='text-align:left; font-size:14px;' style='text-align:left; font-size:14px;'><strong>Tarifa Aprobaci&oacute;n R&aacute;pida (opcional): </strong>El <strong>DEUDOR </strong>tiene a su elecci&oacute;n el uso o no de la aprobaci&oacute;nr&aacute;pida de <strong>CR&Eacute;DITOS PANDA, </strong>no obstante, en caso de uso de la aprobaci&oacute;nr&aacute;pida el <strong>DEUDOR </strong>deber&aacute; sufragar los costos de utilizaci&oacute;n de la misma conforme al valor informado en los t&eacute;rminos y condiciones del pr&eacute;stamo se&ntilde;alados en este documento y se causar&aacute; al momento en el que el <strong>DEUDOR </strong>reciba el monto del pr&eacute;stamo otorgado, no obstante, por comodidad del <strong>DEUDOR, </strong>este monto ser&aacute; diferido en igual cantidad de cuotas mensuales a las acordadas para el pr&eacute;stamo. Pago diferido que desde ya acepta el <strong>DEUDOR </strong>que se realice.</p><p style='text-align:left; font-size:14px;'>En caso de pago anticipado del pr&eacute;stamo antes de la fecha de vencimiento, el <strong>DEUDOR </strong>deber&aacute; pagar a <strong>CR&Eacute;DITOS PANDA </strong>el monto restante que se deba de la tarifa de aprobaci&oacute;n R&aacute;pida.</p><p style='text-align:left; font-size:14px;'>El uso de la aprobaci&oacute;nr&aacute;pida de <strong>CR&Eacute;DITOS PANDA </strong>permitir&aacute; al <strong>DEUDOR:</strong></p><ol style='text-align:left; font-size:14px; padding-left:40px; margin-bottom: 10px;'><li style='list-style-type: inherit;'>Tener respuesta dentro de las 24 horas h&aacute;biles siguientes a su solicitud de cr&eacute;dito.</li><li style='list-style-type: inherit;'>Hacer uso de una metodolog&iacute;a &aacute;gil en el estudio de la solicitud de cr&eacute;dito o de su eventual novaci&oacute;n presentada por el DEUDOR, metodolog&iacute;a que utiliza desarrollostecnol&oacute;gicos especializados que aceleran el proceso y facilita no exigir documentos y garant&iacute;as adicionales tales como, pero sin limitarse a un codeudor con finca ra&iacute;z no hipotecada, certificado de tradici&oacute;n y libertad del inmueble del co-deudor y pagar&eacute; firmado por el codeudor debidamente notariado.</li></ol><p style='text-align:left; font-size:14px;'>Si decides no pagar la Tarifa de Aprobaci&oacute;n R&aacute;pida, pero si la tarifa de plataforma tu solicitud ser&aacute; revisada en un plazo de hasta 15 d&iacute;as h&aacute;biles, despu&eacute;s de ser recibidos viacorreo electr&oacute;nicolos siguientes documentos: A. Certificado de tradici&oacute;n y libertad del inmueble del co-deudor, con fecha no mayor de 30 d&iacute;as a la fecha de presentaci&oacute;n del documento. B. certificaciones laborales del codeudor solidario &lt; 30 d&iacute;as que acredite m&iacute;nimo 6 meses de historia laboral en la empresa. C. Certificado de ingresos, expedido por contador acreditado. D. pagar&eacute; y carta de instrucciones firmados por el codeudor solidario debidamente notarizados.</p><p style='text-align:left; font-size:14px;'>Se entender&aacute; el cobro de la tarifa de aprobaci&oacute;n R&aacute;pida cuando el <strong>DEUDOR </strong>as&iacute; lo haya aceptado en el formulario de solicitud dentro de la p&aacute;gina web y la firma electr&oacute;nica del presente documento implica aceptaci&oacute;n del <strong>DEUDOR </strong>de los cargos de la tarifa aprobaci&oacute;n r&aacute;pida.</p><p style='text-align:left; font-size:14px;'><strong>Tarifa uso de la plataforma (opcional): </strong>El <strong>DEUDOR </strong>tiene a su elecci&oacute;n el uso o no de la plataforma tecnol&oacute;gica de <strong>CR&Eacute;DITOS PANDA, </strong>no obstante, en caso de uso de la plataforma el <strong>DEUDOR </strong>deber&aacute; sufragar los costos de utilizaci&oacute;n de la misma conforme al valor informado en los t&eacute;rminos y condiciones del pr&eacute;stamo, aclarando que la tarifa se calcular&aacute; el primer d&iacute;a h&aacute;bil de cada mes hasta el pago total del pr&eacute;stamo otorgado. Para conveniencia del DEUDOR esta tarifa ser&aacute; distribuida en pagos mensuales iguales hechos por el DEUDOR. En caso de pago anticipado del pr&eacute;stamo la tarifa se calcular&aacute; hasta el momento en que se us&oacute; la plataforma.</p><p style='text-align:left; font-size:14px;'>La tarifa no ser&aacute; cobrada en el caso que el <strong>DEUDOR</strong>decida no hacer uso de la misma y realizar todos los tr&aacute;mites de solicitud del cr&eacute;dito y pagos posteriores de forma f&iacute;sica.</p><p style='text-align:left; font-size:14px;'>El uso de la plataforma de <strong>CR&Eacute;DITOS PANDA </strong>permitir&aacute;:</p><ol style='text-align:left; font-size:14px; padding-left:40px; margin-bottom: 10px;'><li style='list-style-type: inherit;'>Llenar el formulariode solicitud de cr&eacute;dito en l&iacute;nea</li><li style='list-style-type: inherit;'>Acceso a un perfil en l&iacute;nea espec&iacute;ficamente designado para &eacute;ste en la p&aacute;gina web de <strong>CREDITOS PAND</strong></li><li style='list-style-type: inherit;'>Organizaci&oacute;n de informaci&oacute;n (capital, intereses, costos, etc.) del pr&eacute;stamo.</li><li style='list-style-type: inherit;'>Firma digital y/o electr&oacute;nica de documentos.</li><li style='list-style-type: inherit;'>Pagos Electr&oacute;nicos.</li><li style='list-style-type: inherit;'>Seguimiento del progreso del pr&eacute;stamo del <strong>DEUDOR</strong> a trav&eacute;s de plataformas omni-canales (computador, tel&eacute;fono celular)</li><li style='list-style-type: inherit;'>Consulta de pagos y saldos.</li><li style='list-style-type: inherit;'>Recepci&oacute;n de comunicaciones en relaci&oacute;n con promociones y otras actividades de mercadeo;</li><li style='list-style-type: inherit;'>Evitar impresi&oacute;n y env&iacute;o por correo certificado del formulario de solicitud de cr&eacute;dito y otros documentos detallados m&aacute;s adelante.</li></ol><p style='text-align:left; font-size:14px;'>Si decides pagar la Tarifa de Aprobaci&oacute;n R&aacute;pida, pero no la Tarifa de Plataforma, tienes que enviar por correo certificado a nuestras oficinas la siguiente documentaci&oacute;n; A)formulario de solicitud de cr&eacute;dito firmado y notariado B)copia de tu c&eacute;dula ampliada, C) copia de tus servicios p&uacute;blicos D) extracto bancario &uacute;ltimos tres meses E) si eres independiente deber&aacute;s anexar F) certificaci&oacute;n de pagos a la seguridad social y G) copia de la matr&iacute;cula de tu veh&iacute;culo. ADICIONALMENTE si es aprobada tu solicitud deber&aacute;s imprimir y enviarnos H) el presente contrato de mutuo, I) carta de autorizaci&oacute;n de descuento, J) el poder, K) el pagar&eacute; y L) carta de instrucciones debidamente diligenciados y notarizados, a la direcci&oacute;n de nuestras oficinas que aparece en nuestra p&aacute;gina web WWW.CREDITOSPANDA.COM.</p><p style='text-align:left; font-size:14px;'>El solo uso de la plataforma de <strong>CR&Eacute;DITOS PANDA</strong> y la firma del presente documento a trav&eacute;s de la misma, implica aceptaci&oacute;n del <strong>DEUDOR </strong>de los cargos por uso de la plataforma.</p><p style='text-align:left; font-size:14px;'><strong>Si decides aplicar SIN aceptar la Tarifa de Plataforma y la de Aprobaci&oacute;n R&aacute;pida, tendr&aacute;s que enviar por correo certificado los siguientes documentos</strong></p><ol style='text-align:left; font-size:14px; padding-left:40px; margin-bottom: 10px;'><li style='list-style-type: inherit;'>Certificado de tradici&oacute;n y libertad del inmueble del co-deudor, con fecha no mayor de 30 d&iacute;as a la fecha de presentaci&oacute;n del documento.</li><li style='list-style-type: inherit;'>Certificaciones laborales del codeudor solidario &lt; 30 d&iacute;as que acredite m&iacute;nimo 6 meses de historia laboral en la empresa.</li><li style='list-style-type: inherit;'>Certificado de ingresos, expedido por contador acreditado.</li><li style='list-style-type: inherit;'>pagar&eacute; y carta de instrucciones firmados por el codeudor solidario debidamente notarizados.</li><li style='list-style-type: inherit;'>Formulario de solicitud de cr&eacute;dito firmado y notarizado</li><li style='list-style-type: inherit;'>copia de tu c&eacute;dula ampliada</li><li style='list-style-type: inherit;'>copia de tus servicios p&uacute;blicos</li><li style='list-style-type: inherit;'>extracto bancario &uacute;ltimos tres meses</li><li style='list-style-type: inherit;'>Si eres independiente deber&aacute;s anexar: certificaci&oacute;n de pagos a la seguridad social y copia de la matr&iacute;cula de tu veh&iacute;culo.</li><li style='list-style-type: inherit;'>ADICIONALMENTE si es aprobada tu solicitud deber&aacute;s imprimir y enviarnos<ul><li style='list-style-type: inherit;'>El presente contrato de mutuo</li><li style='list-style-type: inherit;'>Carta de autorizaci&oacute;n de descuento</li><li style='list-style-type: inherit;'>el poder</li><li style='list-style-type: inherit;'>el pagar&eacute;</li><li style='list-style-type: inherit;'>carta de instrucciones debidamente diligenciados y notarizados, a la direcci&oacute;n de nuestras oficinas que aparece en nuestra p&aacute;gina web WWW.CREDITOSPANDA.COM.</li></ul></li></ol><p style='text-align:left; font-size:14px;'>Despu&eacute;s de recibir toda la informaci&oacute;n requerida, la respuesta a la solicitud se dar&aacute; en un plazo de hasta 15 d&iacute;as h&aacute;biles.</p></p>"
  msjSubmitM = false
  msjSubmitD = false
  msjTol = true
  msjTolD = true
    //variables config calculadoras
    configCalDias
    configCalMeses
    porExpUno
    porExpDos
    porExpTres
    porExp
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
    txtCorrecto = '<h2>Tu crédito ha sido recibido exitosamente.</h2><h3>Si tu solicitud es aprobada, en minutos recibirás por SMS al celular registrado al igual que al correo electrónico un código único para firmar el contrato electrónicamente.</h3><br><h3>Te agradecemos haber escogido a Créditos Panda</h3>'
    txtPre = '<h2>Tu crédito ha sido aprobado exitosamente</h2><h3>Te agradecemos haber escogido a Créditos Panda</h3><br><p>En unos instantes recibirás por SMS al celular registrado al igual que al correo electrónico un código único para firmar el contrato electrónicamente.</p><br><h4 style="text-align: left;"><strong>Ten en cuenta la siguiente documentación que podrá ser requerida para la aprobación de tu crédito</strong></h4><br><ul class="fondito"><li class="chekin"><p>Si tus ingresos son menores a 1.5 salarios mínimos y puedes demostrar otras fuentes de ingreso entonces se re-evaluara tu solicitud. Enviar los extractos bancarios donde se evidencien estos ingresos al correo info@creditospanda.com.</p></li><li class="chekin"><p>Validar tu identidad es indispensable para nuestro análisis de crédito, verifica que las fotos de tu documento de identidad estén nítidas y claras. </p></li><li class="chekin"><p>Si no tienes vida crediticia te aconsejamos empezar ahora ya sea contratando un plan pospago para tu celular o sacando una tarjeta de crédito</p></li><li class="chekin"><p>Si alguna vez estuviste reportado y ya estas al día, entonces envíanos los soportes de paz y salvo al correo info@creditospanda.com</p></li><li class="chekin"><p>Si estás trabajando como independiente hace menos de 1 año, podemos re-considerar tu solicitud si tienes vehículo o moto a tu nombre. </p></li><li class="chekin"><p>Verifica que los datos de contacto de las referencias personales y comerciales estén al día para poder ser contactadas por nuestro equipo.</p></li></ul>'
    txtError = '<h3>En este momento debido a tu actual situación financiera no podemos aprobar el crédito, te aconsejamos ajustar tus finanzas y que vuelvas a intentarlo nuevamente.</h3>'
    contraOferta
  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private requestService: RequestService,
    private toast: ToastrService,
    private modalService: NgbModal,
    private _modalService: NgbModal,
    private configService: ConfigCalculadoraService,
  ) { 
    this.homeForm = this.fb.group({
      m_solicitado: [250000],
      c_mensual: [2],
      tipo:["m"],
      tasa:[],
      
      subtotal:[],
      plataforma:[],
      aprobacion:[],
      iva:[],
      total_pagar:[],
      idUserFk:[],
      select_all:[false],
      datos:[false, Validators.requiredTrue],
      datos2:[false, Validators.requiredTrue],
      datos3:[false, Validators.requiredTrue],
      datos4:[false],
      datos5:[false],
      datos6:[false, Validators.requiredTrue],
      datos7:[false, Validators.requiredTrue],
      datos8:[false]

    });
    this.homeFormDias = this.fb.group({
      m_solicitado: [175000],
      c_mensual: [15],
      tipo:["d"],
      tasa:[],
      subtotal:[],
      plataforma:[],
      aprobacion:[],
      iva:[],
      total_pagar:[],
      idUserFk:[],
      select_all:[false],
      datos:[false, Validators.requiredTrue],
      datos2:[false, Validators.requiredTrue],
      datos3:[false, Validators.requiredTrue],
      datos4:[false],
      datos5:[false],
      datos6:[false, Validators.requiredTrue],
      datos7:[false, Validators.requiredTrue],
      datos8:[false]
    });
  }
  ngOnInit() {
    registerLocaleData(localeEs, 'es');
    this.configDias();
    this.configMeses();
    // this.obtenerMonto();
    // this.obtenerMonto2();
    this.userLog = JSON.parse(localStorage.getItem('user')).id;
    this.homeForm.controls['idUserFk'].setValue(this.userLog);
    this.homeFormDias.controls['idUserFk'].setValue(this.userLog);
    this.ConsultarInformacion()
  }
  configDias(){
    this.configService.getTipo(2).subscribe((res)=>{
      this.configCalDias = res;
      this.homeFormDias.controls['m_solicitado'].setValue(this.configCalDias.monto_minimo);
      this.homeFormDias.controls['c_mensual'].setValue(this.configCalDias.dias_minimo);
      this.plazoDias = (this.configCalDias ? parseInt(this.configCalDias.dias_minimo) : 15);
      this.montoSolicitadoDias = (this.configCalDias ? parseInt(this.configCalDias.monto_minimo) : 175000);
      this.montoRestDias = (this.configCalDias ? parseInt(this.configCalDias.monto_restriccion) : 0);
      this.montoResTooltipDias = (this.configCalDias ? parseInt(this.configCalDias.monto_restriccion_tooltip) : 0);
      this.diasRestDias = (this.configCalDias ? parseInt(this.configCalDias.dias_restriccion) : 0);
      this.tasaDias = (this.configCalDias ? parseFloat(this.configCalDias.tasa) : 0);
      this.porExpressDias = (this.configCalDias ? parseFloat(this.configCalDias.porcentaje_express) : 0);
      this.porIvaDias = (this.configCalDias ? parseFloat(this.configCalDias.porcentaje_iva) : 0);
      this.porplataformaDias = (this.configCalDias ? parseFloat(this.configCalDias.porcentaje_plataforma) : 0);
      this.obtenerMonto2();
      console.log("CalDias",this.configCalDias);
    },(error)=>{
      console.log(error)
    })
  }
  configMeses(){
    this.configService.getTipo(1).subscribe((res)=>{
      this.configCalMeses = res;
      this.homeForm.controls['m_solicitado'].setValue(this.configCalMeses.monto_minimo);
      this.homeForm.controls['c_mensual'].setValue(this.configCalMeses.dias_minimo);
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
      this.obtenerMonto();
      console.log("CalMeses",res);
    },(error)=>{
      console.log(error)
    })
  } 
  obtenerMonto(){
console.log('monto1')
    let porPlat = this.porplataformaMeses > 0 ? this.porplataformaMeses : 4;
    let porIva = this.porIvaMeses > 0 ? this.porIvaMeses : 19;
    let tasa = this.tasaMeses > 0 ? this.tasaMeses : 0.01916667;
    if(this.codigoDescuento!=0){
      if(this.codigoDescuento==15){
        this.porExpUno = 25.5;
        this.porExpDos = 23.4;
        this.porExpTres = 21.3;
      }else if(this.codigoDescuento==10){
        this.porExpUno = 27;
        this.porExpDos = 24.8;
        this.porExpTres = 22.5;
      }
   
    }else{
      this.porExpUno = this.porExpressMeses > 0 ? this.porExpressMeses : 30;
      this.porExpDos = this.porExpressDosMeses > 0 ? this.porExpressDosMeses : 27.5;
      this.porExpTres = this.porExpressTresMeses > 0 ? this.porExpressTresMeses : 25;
    }

  this.montoSolicitado=this.homeForm.get('m_solicitado').value;

      this.plataforma=parseFloat(this.homeForm.get('m_solicitado').value)*(porPlat/100);

      // console.log('plataverga inicial',this.plataforma)
      this.homeForm.controls['c_mensual'].setValue(this.cant_mensual);
      let cuotas=this.cant_mensual;
      let monto=this.homeForm.get('m_solicitado').value;
      this.t_interes = monto *( (tasa * Math.pow(1 + tasa, cuotas)) / (Math.pow(1 + tasa, cuotas) - 1) );
    //  console.log('tasa',this.t_interes.toFixed());
      this.getAmortizacion(tasa);
      

      if(this.homeForm.get('m_solicitado').value<=1200000){
      
      
          console.log('esta vacio')
          this.ap_express=parseFloat(this.homeForm.get('m_solicitado').value)*this.porExpUno/100;
      
        
        // this.iva=(parseFloat(this.plataforma)+parseFloat(this.ap_express))*19/100;
        this.plataforma=parseFloat(this.plataforma)*parseFloat(this.homeForm.get('c_mensual').value)
        this.iva=(parseFloat(this.plataforma)+parseFloat(this.ap_express))*porIva/100;
        this.total=parseFloat(this.subtotal)+parseFloat(this.plataforma)+parseFloat(this.ap_express)+parseFloat(this.iva)
        this.cuotaMensual=Math.round(parseFloat(this.total)/parseFloat(this.homeForm.get('c_mensual').value))
       
      }else
      if(this.homeForm.get('m_solicitado').value>1200000 && this.homeForm.get('m_solicitado').value<=1700000){
        // this.ap_express=parseFloat(this.homeForm.get('m_solicitado').value)*porExpDos/100;
      
          this.ap_express=parseFloat(this.homeForm.get('m_solicitado').value)*this.porExpDos/100;
       
        // this.iva=(parseFloat(this.plataforma)+parseFloat(this.ap_express))*19/100;

        this.plataforma=parseFloat(this.plataforma)*parseFloat(this.homeForm.get('c_mensual').value)
        this.iva=(parseFloat(this.plataforma)+parseFloat(this.ap_express))*porIva/100;
        this.total=parseFloat(this.subtotal)+parseFloat(this.plataforma)+parseFloat(this.ap_express)+parseFloat(this.iva)
        this.cuotaMensual=Math.round(parseFloat(this.total)/parseFloat(this.homeForm.get('c_mensual').value))        
       
      }else
      if(this.homeForm.get('m_solicitado').value>=1700001){

      
          this.ap_express=parseFloat(this.homeForm.get('m_solicitado').value)*this.porExpTres/100;
        
        
        // this.ap_express=parseFloat(this.homeForm.get('m_solicitado').value)*porExpTres/100;
        // this.iva=(parseFloat(this.plataforma)+parseFloat(this.ap_express))*19/100;
        this.plataforma=parseFloat(this.plataforma)*parseFloat(this.homeForm.get('c_mensual').value)
        let plata=parseFloat(this.plataforma)*parseFloat(this.homeForm.get('c_mensual').value);
        this.iva=(parseFloat(this.plataforma)+parseFloat(this.ap_express))*porIva/100;
        this.total=parseFloat(this.subtotal)+parseFloat(this.plataforma)+parseFloat(this.ap_express)+parseFloat(this.iva)
        this.cuotaMensual=Math.round(parseFloat(this.total)/parseFloat(this.homeForm.get('c_mensual').value))
      

      }
      


      this.homeForm.controls['subtotal'].setValue(this.subtotal);
      this.homeForm.controls['plataforma'].setValue(this.plataforma);
      this.homeForm.controls['aprobacion'].setValue(this.ap_express);
      this.homeForm.controls['iva'].setValue(this.iva);
      this.homeForm.controls['total_pagar'].setValue(this.total);

     
  }

  getAmortizacion(tasa) {
      var valor_de_cuota = this.t_interes;
      var saldo_al_capital = this.homeForm.get('m_solicitado').value;
      let interesos;
      let abono_al_capital:any;
      var items = new Array();
      let sum=0;
      let resta:any=1000;

      for (let i=0; i < this.homeForm.get('c_mensual').value; i++) {
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
      this.homeForm.controls['tasa'].setValue(this.taxInTotal.toFixed(0));
      this.subtotal=Math.round(parseFloat(this.montoSolicitado)+parseFloat(this.taxInTotal));
  
  }
  obtenerMonto2(){
    let porPlat = this.porplataformaDias > 0 ? this.porplataformaDias : 1000;
    let porIva = this.porIvaDias > 0 ? this.porIvaDias : 19;
    let tasa = this.tasaDias > 0 ? this.tasaDias : 14;
 
console.log('codigo',this.codigoDescuento)

    if(this.codigoDescuento!=0){
      if(this.codigoDescuento==15){
        this.porExp =  13.6;
      }else if(this.codigoDescuento==10){
        this.porExp =  14.4;
      }
   
    }else{
      this.porExp = this.porExpressDias > 0 ? this.porExpressDias : 12.5;
    }


    this.plazoDias=this.homeFormDias.get('c_mensual').value;
    this.montoSolicitadoDias=this.homeFormDias.get('m_solicitado').value;
    let tasitaNueva=(Math.pow((1+(tasa/100)),(this.plazoDias/360))-1);
    this.t_interesDias=tasitaNueva*this.montoSolicitadoDias;

    // this.t_interesDias=(Math.round((parseFloat(this.montoSolicitadoDias)*parseFloat(this.plazoDias))*tasa/360))/100
    this.subtotalDias=parseFloat(this.montoSolicitadoDias)+parseFloat(this.t_interesDias);

    this.plataformaDias=porPlat*parseFloat(this.plazoDias);
    this.ap_expressDias=parseFloat(this.montoSolicitadoDias)*this.porExp/100
    this.ivaDias=(parseFloat(this.plataformaDias)+parseFloat(this.ap_expressDias))*porIva/100
    this.totalDias=parseFloat(this.subtotalDias)+parseFloat(this.plataformaDias)+parseFloat(this.ap_expressDias)+parseFloat(this.ivaDias)

    this.homeFormDias.controls['tasa'].setValue(this.t_interesDias.toFixed(0));
    this.homeFormDias.controls['subtotal'].setValue(this.subtotalDias);
    this.homeFormDias.controls['plataforma'].setValue(this.plataformaDias);
    this.homeFormDias.controls['aprobacion'].setValue(this.ap_expressDias);
    this.homeFormDias.controls['iva'].setValue(this.ivaDias);
    this.homeFormDias.controls['total_pagar'].setValue(this.totalDias);
  }
  monto_solicitado(value, tooltip){
  
    if(value){
      let mrt = this.montoResTooltipMeses > 0 ? this.montoResTooltipMeses : 1100000
      let mr = this.montoRestMeses > 0 ? this.montoRestMeses : 1000000
      let dr = this.diasRestMeses > 0 ? this.diasRestMeses : 4
      // if(this.validacionCal){
        if(value.srcElement.valueAsNumber<=mrt){
  
          // this.locote=1
          if(value.srcElement.valueAsNumber>=mr && this.cant_mensual < dr){
            this.homeForm.controls['c_mensual'].setValue(dr);
            this.cant_mensual = dr;
            this.range = dr;
            this.plazoMeses = dr;
          
          }
          this.montoSolicitado = value.srcElement.valueAsNumber;
        }else{
          this.montoSolicitado = mrt;
          this.homeForm.controls['m_solicitado'].setValue(mrt);
          if(value.srcElement.valueAsNumber>=mr && this.cant_mensual < dr){
            this.homeForm.controls['c_mensual'].setValue(dr);
            this.cant_mensual = dr;
            this.range = dr;
            this.plazoMeses = dr;
          
          }
          this.msjTol = false;
          tooltip.open();
          setTimeout( () => {
            this.msjTol = true;
            tooltip.close();
        }, 5000)
       
        }
     
        this.obtenerMonto();
  
      }
    
  }
  plazo_mensual(value){

    if(value){
      let mrt = this.montoResTooltipMeses > 0 ? this.montoResTooltipMeses : 1100000
      let mr = this.montoRestMeses > 0 ? this.montoRestMeses : 1000000
      let dr = this.diasRestMeses > 0 ? this.diasRestMeses : 4
      if(this.homeForm.get('m_solicitado').value>=mr && value.srcElement.valueAsNumber < dr){
        this.homeForm.controls['c_mensual'].setValue(dr);
        this.cant_mensual = dr;
        this.range = dr;
        this.plazoMeses = dr;
   
      }else{
        this.plazoMeses = value.srcElement.valueAsNumber;
        this.cant_mensual = value.srcElement.valueAsNumber;
    
      }
      
      this.obtenerMonto();
      // this.calculadora_solicitado();
    }
  
  }
  monto_solicitado_dias(value, tooltip){
    
      if(value){
        let mrt = this.montoResTooltipDias> 0 ? this.montoResTooltipDias: 500000
        
          if(value.srcElement.valueAsNumber > mrt){
      
            this.homeFormDias.controls['m_solicitado'].setValue(mrt);
            this.msjTolD = false
            tooltip.open();
            setTimeout( () => {
              this.msjTolD = true
              tooltip.close();
          }, 5000)
          }
        this.obtenerMonto2();
      }
      
    }
  get fm() { return this.homeForm.controls; }
    GuardarSolicitudMeses(){
      this.submittedM = true
      if(this.homeForm.valid){
        console.log(this.homeForm.value);
        if(this.homeForm.get("datos4").value == false || this.homeForm.get("datos5").value == false){
          const confirm = swal.fire({
            title: "<strong>Tarifa de Aprobación Rapida y Tarifa de Plataforma</strong>",
            html: this.txt,
            type: 'question',
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: 'Confirmar',
            confirmButtonText: 'Confirmar',
            focusCancel: true,
            width: "80%",
            customClass: {
              icon: 'icon-class',
              confirmButton: 'confirm-button-class',
              cancelButton: 'cancel-button-class'
            }
          });
    
          from(confirm).subscribe(r => {
            
            if (r['value']) {
              this.msjSubmitM = true;
              this.requestService.add(this.homeForm.value).subscribe(response => {
                if (response) {
                  this.requestService.obtenerCupon({nombre:this.valorCupon}).subscribe((res)=>{
                    console.log('aqui viene los datos',res)
                       // return true
                       this.codigoDescuento=JSON.parse(JSON.stringify(res)).valor;
                      //  if(this.codigoDescuento==0){
                      //    this.toast.error(JSON.parse(JSON.stringify(res)).message);
                      //  }else{
                      //    this.toast.success(JSON.parse(JSON.stringify(res)).message);
                      //  }
                       
                       this.obtenerMonto()
                     },(error)=>{
                
                       // return false;
                     })
                  this.msjSubmitM =false
                  let analisis = JSON.parse(JSON.stringify(response)).analisis
                  this.contraOferta = JSON.parse(JSON.stringify(response)).analisis.contra_oferta
                  if(analisis.estatus_solicitud == 'negado'){
                    this.modalError();
                    this.toast.error(JSON.parse(JSON.stringify(response)).message);
                  }else if(analisis.estatus_solicitud == 'aprobado'){
                    this.modalCorrecto();
                    // this.toast.success(JSON.parse(JSON.stringify(response)).message);

                  }
                  // if(analisis.estatus_solicitud == 'kj'){
                  //   const confirm =this.modalPreaprobado();
                  //   from(confirm).subscribe(r => {
                  //     // this.modalContraOfertaPre();
                      
                  //   })
                  // }else 
                  // this.toast.success(JSON.parse(JSON.stringify(response)).message);
                  // this.router.navigate(['/credit/new-request']);
                } else {
                  this.toast.error(JSON.stringify(response));
                }
              },(error)=>
              {
                this.msjSubmitM =false
                console.log(error)
                let mensaje =error.error.message;
                this.toast.error(mensaje);
              });
            }
          });
        }else{
          const confirm = swal.fire({
            title: "<strong>¿ Desea enviar la solicitud ?</strong>",
            html: '',
            type: 'question',
            showConfirmButton: true,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Confirmar',
            focusCancel: true,
            width: "60%",
            customClass: {
              icon: 'icon-class',
              confirmButton: 'confirm-button-class',
              cancelButton: 'cancel-button-class'
            }
          });
    
          from(confirm).subscribe(r => {
            
            if (r['value']) {
              this.msjSubmitM = true;
              this.requestService.add(this.homeForm.value).subscribe(response => {
        
                if (response) {

                  this.requestService.obtenerCupon({nombre:this.valorCupon}).subscribe((res)=>{
                    console.log('aqui viene los datos',res)
                       // return true
                       this.codigoDescuento=JSON.parse(JSON.stringify(res)).valor;
                      //  if(this.codigoDescuento==0){
                      //    this.toast.error(JSON.parse(JSON.stringify(res)).message);
                      //  }else{
                      //    this.toast.success(JSON.parse(JSON.stringify(res)).message);
                      //  }
                       
                       this.obtenerMonto()
                     },(error)=>{
                
                       // return false;
                     })
                  this.msjSubmitM =false
                  let analisis = JSON.parse(JSON.stringify(response)).analisis
                  this.contraOferta = JSON.parse(JSON.stringify(response)).analisis.contra_oferta
                  if(analisis.estatus_solicitud == 'negado'){
                    this.modalError();
                    this.toast.error(JSON.parse(JSON.stringify(response)).message);
                  }else if(analisis.estatus_solicitud == 'preaprobado'){
                    const confirm =this.modalPreaprobado();
                  }else if(analisis.estatus_solicitud == 'aprobado'){
                    const confirm =this.modalCorrecto();
                    // this.toast.success(JSON.parse(JSON.stringify(response)).message);
                  }
                  // this.toast.success(JSON.parse(JSON.stringify(response)).message);
                  // this.router.navigate(['/credit/new-request']);
                } else {
                  this.toast.error(JSON.stringify(response));
                }
              },(error)=>
              {
                this.msjSubmitM =false
                console.log(error)
                let mensaje =error.error.message;
                this.toast.error(mensaje);
              });
            }
          });
        }
        
      }
    }
    get fd() { return this.homeFormDias.controls; }
    GuardarSolicitudDias(){
      this.submittedD = true
      if(this.homeFormDias.valid){
   
        if(this.homeFormDias.get("datos4").value == false || this.homeFormDias.get("datos5").value == false){
          const confirm = swal.fire({
            title: "<strong>Tarifa de Aprobación Rapida y Tarifa de Plataforma</strong>",
            html: this.txt,
            type: 'question',
            showConfirmButton: true,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Confirmar',
            focusCancel: true,
            width: "80%",
            customClass: {
              icon: 'icon-class',
              confirmButton: 'confirm-button-class',
              cancelButton: 'cancel-button-class'
            }
          });
    
          from(confirm).subscribe(r => {
            
            if (r['value']) {
              this.msjSubmitD = true;
              this.requestService.add(this.homeFormDias.value).subscribe(response => {
                if (response) {
                  this.requestService.obtenerCupon({nombre:this.valorCupon}).subscribe((res)=>{
                    console.log('aqui viene los datos',res)
                       // return true
                       this.codigoDescuento=JSON.parse(JSON.stringify(res)).valor;
                      //  if(this.codigoDescuento==0){
                      //    this.toast.error(JSON.parse(JSON.stringify(res)).message);
                      //  }else{
                      //    this.toast.success(JSON.parse(JSON.stringify(res)).message);
                      //  }
                       
                       this.obtenerMonto()
                     },(error)=>{
                
                       // return false;
                     })
                  this.msjSubmitD = false
                  let analisis = JSON.parse(JSON.stringify(response)).analisis
                  this.contraOferta = JSON.parse(JSON.stringify(response)).analisis.contra_oferta
                  if(analisis.estatus_solicitud == 'negado'){
                    this.modalError();
                    this.toast.error(JSON.parse(JSON.stringify(response)).message);
                  }else if(analisis.estatus_solicitud == 'preaprobado'){
                    const confirm =this.modalPreaprobado();
                    from(confirm).subscribe(r => {
                      // this.modalContraOfertaPre();
                      
                    })
                  }else if(analisis.estatus_solicitud == 'aprobado'){
                    const confirm =this.modalCorrecto();
                    // this.toast.success(JSON.parse(JSON.stringify(response)).message);
                  }
                  // this.toast.success(JSON.parse(JSON.stringify(response)).message);
                  // this.router.navigate(['/credit/new-request']);
                } else {
                  this.msjSubmitD =false
                  this.toast.error(JSON.stringify(response));
                }
              },(error)=>
              {
                this.msjSubmitD =false
                console.log(error)
                let mensaje =error.error.message;
                this.toast.error(mensaje);
              });
            }
          });
        }else{
          const confirm = swal.fire({
            title: "<strong>¿ Desea enviar la solicitud ?</strong>",
            html: '',
            type: 'question',
            showConfirmButton: true,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Confirmar',
            focusCancel: true,
            width: "60%",
            customClass: {
              icon: 'icon-class',
              confirmButton: 'confirm-button-class',
              cancelButton: 'cancel-button-class'
            }
          });
    
          from(confirm).subscribe(r => {
            
            if (r['value']) {
              this.msjSubmitD = true;
              this.requestService.add(this.homeFormDias.value).subscribe(response => {
                if (response) {
                  this.msjSubmitD = false
                  this.requestService.obtenerCupon({nombre:this.valorCupon}).subscribe((res)=>{
                    console.log('aqui viene los datos',res)
                       // return true
                       this.codigoDescuento=JSON.parse(JSON.stringify(res)).valor;
                      //  if(this.codigoDescuento==0){
                      //    this.toast.error(JSON.parse(JSON.stringify(res)).message);
                      //  }else{
                      //    this.toast.success(JSON.parse(JSON.stringify(res)).message);
                      //  }
                       
                       this.obtenerMonto()
                     },(error)=>{
                
                       // return false;
                     })
                  let analisis = JSON.parse(JSON.stringify(response)).analisis
                  this.contraOferta = JSON.parse(JSON.stringify(response)).analisis.contra_oferta
                  if(analisis.estatus_solicitud == 'negado'){
                    this.modalError();
                    this.toast.error(JSON.parse(JSON.stringify(response)).message);
                  }else if(analisis.estatus_solicitud == 'preaprobado'){
                    const confirm =this.modalPreaprobado();
                    from(confirm).subscribe(r => {
                      // this.modalContraOfertaPre();
                    })
                  }else if(analisis.estatus_solicitud == 'aprobado'){
                    const confirm =this.modalCorrecto();
                    // this.toast.success(JSON.parse(JSON.stringify(response)).message);
                  }
                 
                  // this.toast.success(JSON.parse(JSON.stringify(response)).message);
                  // this.router.navigate(['/credit/new-request']);
                } else {
                  this.msjSubmitD =false
                  this.toast.error(JSON.stringify(response));
                }
              },(error)=>
              {
                this.msjSubmitD =false
            
                let mensaje =error.error.message;
                this.toast.error(mensaje);
              });
            }
          });
        }


      }
    }

    ConsultarInformacion(){
      
      
        this.requestService.informacionCompleta(this.userLog).subscribe(response => {
   
            this.desahabilitado=false
         
        },(error)=>
        {
          this.desahabilitado=true
          let mensaje =error.error.message;
          this.toast.error('Debe completar su información para poder solicitar crédito');

          // Object.keys(mensaje).forEach(key => {
          //   console.log(key)
          //   this.toast.error(mensaje[key][0]);
          //   console.log(mensaje[key][0])
          //  });
        });
        // localStorage.setItem('solicitud', JSON.stringify(this.homeFormDias.value));
        // this.router.navigate(['registro']);
     
    }
    obtenerCalc(e){
      if(e=="m"){
      
        this.cualMostrar=1;
      }else if(e=="d"){
        
        this.cualMostrar=2;
      }else{
  
        this.cualMostrar=0;
      }
      this.submittedD =false;
      this.homeFormDias.controls['select_all'].setValue(false);
      this.homeFormDias.controls['datos'].setValue(false);
      this.homeFormDias.controls['datos2'].setValue(false);
      this.homeFormDias.controls['datos3'].setValue(false);
      this.homeFormDias.controls['datos4'].setValue(false);
      this.homeFormDias.controls['datos5'].setValue(false);
      this.homeFormDias.controls['datos6'].setValue(false);
      this.submittedM =false;
      this.homeForm.controls['select_all'].setValue(false);
      this.homeForm.controls['datos'].setValue(false);
      this.homeForm.controls['datos2'].setValue(false);
      this.homeForm.controls['datos3'].setValue(false);
      this.homeForm.controls['datos4'].setValue(false);
      this.homeForm.controls['datos5'].setValue(false);
      this.homeForm.controls['datos6'].setValue(false);
    }
    seleccionarTodoMeses(event){
  
      if(event.srcElement.checked){
        this.homeForm.controls['datos'].setValue(true);
        this.homeForm.controls['datos2'].setValue(true);
        this.homeForm.controls['datos3'].setValue(true);
        this.homeForm.controls['datos4'].setValue(true);
        this.homeForm.controls['datos5'].setValue(true);
        this.homeForm.controls['datos6'].setValue(true);
        this.homeForm.controls['datos7'].setValue(true);
        this.homeForm.controls['datos8'].setValue(true);
        // this.seleccionados=0
      }else{
        // this.seleccionados=1
        this.homeForm.controls['datos'].setValue(false);
        this.homeForm.controls['datos2'].setValue(false);
        this.homeForm.controls['datos3'].setValue(false);
        this.homeForm.controls['datos4'].setValue(false);
        this.homeForm.controls['datos5'].setValue(false);
        this.homeForm.controls['datos6'].setValue(false);
        this.homeForm.controls['datos7'].setValue(false);
        this.homeForm.controls['datos8'].setValue(false);
      }
    }
    seleccionarTodoDias(event){
     
      if(event.srcElement.checked){
        this.homeFormDias.controls['datos'].setValue(true);
        this.homeFormDias.controls['datos2'].setValue(true);
        this.homeFormDias.controls['datos3'].setValue(true);
        this.homeFormDias.controls['datos4'].setValue(true);
        this.homeFormDias.controls['datos5'].setValue(true);
        this.homeFormDias.controls['datos6'].setValue(true);
        this.homeFormDias.controls['datos7'].setValue(true);
        this.homeFormDias.controls['datos8'].setValue(true);
        // this.seleccionados=0
      }else{
        // this.seleccionados=1
        this.homeFormDias.controls['datos'].setValue(false);
        this.homeFormDias.controls['datos2'].setValue(false);
        this.homeFormDias.controls['datos3'].setValue(false);
        this.homeFormDias.controls['datos4'].setValue(false);
        this.homeFormDias.controls['datos5'].setValue(false);
        this.homeFormDias.controls['datos6'].setValue(false);
        this.homeFormDias.controls['datos7'].setValue(false);
        this.homeFormDias.controls['datos8'].setValue(false);
      }
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
    toggleWithGreeting(tooltip) {
      if (tooltip.isOpen()) {
        tooltip.close();
      } else {
        tooltip.open();
      }
    }

    modalCorrecto(){
      const confirm = swal.fire({
        title: "<strong style='color:#0CC27E;'>¡Felicitaciones!</strong>",
        html: this.txtCorrecto,
        type: 'success',
        showConfirmButton: true,
        showCancelButton: false,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Cerrar',
        focusCancel: false,
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
        cancelButtonText: 'Cerrar',
        confirmButtonText: 'Cerrar',
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
        title: "<strong style='color:#fdcb30'>¡Credito Pre-aprobado!</strong>",
        html: this.txtPre,
        type: 'success',
        showConfirmButton: true,
        showCancelButton: false,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Siguiente',
        focusCancel: false,
        width: "80%",
        customClass: {
          icon: 'icon-class-yellow',
          confirmButton: 'confirm-button-class',
          cancelButton: 'cancel-button-class'
        }
      });

      return confirm;
    }

    modalContraOfertaPre(){
      let montoSolicitado = formatNumber(this.contraOferta.montoSolicitado, 'es')
      let montoAprobado = formatNumber(this.contraOferta.montoAprobado, 'es')
      let tasaInteres = formatNumber(this.contraOferta.tasaInteres, 'es')
      let subtotal = formatNumber(this.contraOferta.subtotal, 'es')
      let plataforma = formatNumber(this.contraOferta.plataforma, 'es')
      let aprobacionRapida = formatNumber(this.contraOferta.aprobacionRapida, 'es')
      let iva = formatNumber(this.contraOferta.iva, 'es')
      let totalPagar = formatNumber(this.contraOferta.totalPagar, 'es')
      let text = '<h4>Sin embargo debemos hacerte una contra oferta la cual puedes aceptar o rechazar.</h4><div class="row"><div class="col-md-6 col-md-offset-3" style="margin:auto;"><table class="table table-bordered"><tbody><tr><th>Monto Solicitado</th><td>$ '+montoSolicitado+'</td></tr><tr><th>Monto Aprobado</th><td>$ '+montoAprobado+'</td></tr><tr><th>Tasa de interes</th><td>$ '+tasaInteres+'</td></tr><tr><th>Subtotal</th><td>$ '+subtotal+'</td></tr><tr><th>Plataforma</th><td>$ '+plataforma+'</td></tr><tr><th>Aprobación rapida</th><td>$ '+aprobacionRapida+'</td></tr><tr><th>IVA</th><td>$ '+iva+'</td></tr><tr><th>Total a pagar</th><td>$ '+totalPagar+'</td></tr></tbody></table></div></div>'
      const confirm = swal.fire({
        title: "<strong style='color:#fdcb30'>¡Credito Pre-aprobado!</strong>",
        html: text,
        type: 'warning',
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
          this.editCo(rr['value']);
        }else{
          const ms = this.modalSeguro();
          from (ms).subscribe(r=>{
            if(r['value']){
              this.editCo(false);
            }else{
              this.modalContraOfertaPre();
            }
          })
        }
        
      })
    
      // return confirm;
    }
    modalContraOfertaCorrecto(){
      let montoSolicitado = formatNumber(this.contraOferta.montoSolicitado, 'es')
      let montoAprobado = formatNumber(this.contraOferta.montoAprobado, 'es')
      let tasaInteres = formatNumber(this.contraOferta.tasaInteres, 'es')
      let subtotal = formatNumber(this.contraOferta.subtotal, 'es')
      let plataforma = formatNumber(this.contraOferta.plataforma, 'es')
      let aprobacionRapida = formatNumber(this.contraOferta.aprobacionRapida, 'es')
      let iva = formatNumber(this.contraOferta.iva, 'es')
      let totalPagar = formatNumber(this.contraOferta.totalPagar, 'es')
      let text = '<h4>Sin embargo debemos hacerte una contra oferta la cual puedes aceptar o rechazar.</h4><div class="row"><div class="col-md-6 col-md-offset-3" style="margin:auto;"><table class="table table-bordered"><tbody><tr><th>Monto Solicitado</th><td>$ '+montoSolicitado+'</td></tr><tr><th>Monto Aprobado</th><td>$ '+montoAprobado+'</td></tr><tr><th>Tasa de interes</th><td>$ '+tasaInteres+'</td></tr><tr><th>Subtotal</th><td>$ '+subtotal+'</td></tr><tr><th>Plataforma</th><td>$ '+plataforma+'</td></tr><tr><th>Aprobación rapida</th><td>$ '+aprobacionRapida+'</td></tr><tr><th>IVA</th><td>$ '+iva+'</td></tr><tr><th>Total a pagar</th><td>$ '+totalPagar+'</td></tr></tbody></table></div></div>'
      const confirm = swal.fire({
        title: "<strong style='color:#fdcb30;'>¡Felicitaciones!</strong>",
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
          this.editCo(rr['value']);
        }else{
          const ms = this.modalSeguro();
          from (ms).subscribe(r=>{
            if(r['value']){
              this.editCo(false);
            }else{
              this.modalContraOfertaCorrecto();
            }
          })
        }
        
      })
      // return confirm;
    }
    editCo(estatus){
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
     
        return true
      },(error)=>{
 
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
    canjear(val){
      this.valorCupon=val;
      console.log('holas',val)
      this.requestService.obtenerCuponPreview({nombre:val}).subscribe((res)=>{
     console.log('aqui viene los datos',res)
        // return true
        this.codigoDescuento=JSON.parse(JSON.stringify(res)).valor;
        if(this.codigoDescuento==0){
          this.toast.error(JSON.parse(JSON.stringify(res)).message);
        }else{
          this.toast.success(JSON.parse(JSON.stringify(res)).message);
        }
        
        this.obtenerMonto()
        this.obtenerMonto2()
      },(error)=>{
 
        // return false;
      })
    }
}
