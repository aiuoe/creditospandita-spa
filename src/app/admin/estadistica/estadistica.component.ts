import { Component, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { FiltradoService } from 'app/shared/services/filtrado.service';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styleUrls: ['./estadistica.component.scss']
})
export class EstadisticaComponent implements OnInit {

  aprobadosFormulario=0;
  negadoFormulario=0;
  incompletoFormulario=0;
  aprobadoInterno=0;
  negadoInterno=0;
  faltaEvaluacion=0;
  percentajeAprobacion=0;
  clientesRetornan=0;
  percentajeRetorno=0;
  creditosDesembolsados=0;
  cupones$: Observable<any[]>;
  total = 0;
  p=1;
  itemsPerPage = 5;
  filter: any = ''

  creditosPm = 0;
  creditosPd = 0;
  totalcreditos = 0;
  capitalCreditosPm = 0;
  capitalCreditosPd = 0;
  totalCapitalCreditos = 0;
  totalVisitantes = 0;
  totalRegistrados = 0;
  totalValidado = 0;
  totalIncompleto = 0;


  creditosAbiertosPm = 0;
  creditosAbiertosPd = 0;
  capitalpxpM = 0;
  interespxpM = 0;
  plataformapxpM = 0;
  aprobacionpxpM = 0;
  ivapxpM = 0;
  capitalpxpD = 0;
  interespxpD = 0;
  plataformapxpD = 0;
  aprobacionpxpD = 0;
  ivapxpD = 0;
  totalPxpM = 0;
  totalPxpD = 0;
  totalPxp = 0;

  totalCreditosAbiertos = 0;
  totalCapital = 0;
  totalInteres = 0;
  totalPlataforma = 0;
  totalAprobacion = 0;
  totalIva = 0;
  interesMoraPendientepxpM = 0;
  gastosCobranzapxpM = 0;
  ivaGastosCobranzapxpM = 0;
  interesMoraPendientepxpD = 0;
  gastosCobranzapxpD = 0;
  ivaGastosCobranzapxpD = 0;
  totalInteresMoraPendientepxp = 0;
  totalGastosCobranzapxp = 0;
  totalIvaGastosCobranzapxp = 0;

  diasMora15Pm = 0;
  diasMora30Pm = 0;
  diasMora60Pm = 0;
  diasMora90Pm = 0;
  diasMora120Pm = 0;
  diasMora180Pm = 0;
  diasMora360Pm = 0;
  diasMoraMayor360Pm = 0;
  diasMoraPm = 0;
  diasMora15Pd = 0;
  diasMora30Pd = 0;
  diasMora60Pd = 0;
  diasMora90Pd = 0;
  diasMora120Pd = 0;
  diasMora180Pd = 0;
  diasMora360Pd = 0;
  diasMoraMayor360Pd = 0;
  diasMoraPd = 0;

  totalMora15Pd = 0;
  totalMora30Pd = 0;
  totalMora60Pd = 0;
  totalMora90Pd = 0;
  totalMora120Pd = 0;
  totalMora180Pd = 0;
  totalMora360Pd = 0;
  totalMoraMayor360Pd = 0;
  totalMora = 0;
  totalMoraPm = 0;
  totalMoraPd = 0;
  totalDiasMora = 0;
  totalCreditosMorososPm = 0;
  totalCreditosMorososPd = 0;
  totalCreditosMorosos = 0;

  totalMora15 = 0;
  totalMora30 = 0;
  totalMora60 = 0;
  totalMora90 = 0;
  totalMora120 = 0;
  totalMora180 = 0;
  totalMora360 = 0;
  totalMoraMayor360 = 0;


  constructor(private FiltradoService: FiltradoService, private toast: ToastrService) {
    this.cupones$ = this.FiltradoService.cupones$;
   }

  ngOnInit() {
    registerLocaleData(localeEs, 'es');
    let param;
    if(this.p)
      { 
        param={page:this.p,per_page:this.itemsPerPage};
      }else{
        param={page:1,per_page:this.itemsPerPage};
      }
    // this.loadInitialData();
  }
  loadInitialData(){
    this.FiltradoService.estadisticas(this.filter).subscribe(response => {
      console.log(response);
      
      if (response) {
        // this.toast.success(response['message']);
        // let param={limit:this.itemsPerPage,offset:this.p};
        // this.loadInitialData()
        console.log('esta es  la estadistica',response)
        this.aprobadosFormulario=JSON.parse(JSON.stringify(response)).aprobadosFormulario
        this.negadoFormulario=JSON.parse(JSON.stringify(response)).negadoFormulario
        this.incompletoFormulario=JSON.parse(JSON.stringify(response)).incompletosFormulario
        this.aprobadoInterno=JSON.parse(JSON.stringify(response)).aprobadoInterno
        this.negadoInterno=JSON.parse(JSON.stringify(response)).negadoInterno
        this.faltaEvaluacion=JSON.parse(JSON.stringify(response)).faltaEvaluacion
        this.percentajeAprobacion=JSON.parse(JSON.stringify(response)).percentajeAprobacion
        this.clientesRetornan=JSON.parse(JSON.stringify(response)).clientesRetornan
        this.percentajeRetorno=JSON.parse(JSON.stringify(response)).percentajeRetorno
        this.creditosDesembolsados = response['desembolsados'];

        this.creditosPm = response['creditosDesembolsadosPm'];
        this.creditosPd = response['creditosDesembolsadosPd'];
        this.totalcreditos = response['totalCreditosDesembolsados'];
        this.capitalCreditosPm = response['capitalDesembolsadosPm'];
        this.capitalCreditosPd = response['capitalDesembolsadosPd'];
        this.totalCapitalCreditos = response['totalCapitalCreditosDesembolsados'];
        this.totalVisitantes = response['totalVisitantes'];
        this.totalRegistrados = response['totalRegistrados'];
        this.totalValidado = response['totalValidado'];
        this.totalIncompleto = response['totalIncompleto'];

        //CREDITOS ABIERTOS PENDIENTE POR PAGAR
        this.creditosAbiertosPm = response['creditosAbiertosPm'];
        this.creditosAbiertosPd = response['creditosAbiertosPd'];

        this.capitalpxpM = response['capitalpxpM'];
        this.interespxpM = response['interespxpM'];
        this.plataformapxpM = response['plataformapxpM'];
        this.aprobacionpxpM = response['aprobacionpxpM'];
        this.ivapxpM = response['ivapxpM'];

        this.capitalpxpD = response['capitalpxpD'];
        this.interespxpD = response['interespxpD'];
        this.plataformapxpD = response['plataformapxpD'];
        this.aprobacionpxpD = response['aprobacionpxpD'];
        this.ivapxpD = response['ivapxpD'];

        this.totalPxpM = response['totalPxpM'];
        this.totalPxpD = response['totalPxpD'];
        
        this.totalCreditosAbiertos = response['totalCreditosAbiertos'];
        this.totalPxp = response['totalPxp'];
        this.totalCapital = response['totalCapital'];
        this.totalInteres = response['totalInteres'];
        this.totalPlataforma = response['totalPlataforma'];
        this.totalAprobacion = response['totalAprobacion'];
        this.totalIva = response['totalIva'];

        this.interesMoraPendientepxpM = response['interesMoraPendientepxpM'];
        this.gastosCobranzapxpM = response['gastosCobranzapxpM'];
        this.ivaGastosCobranzapxpM = response['ivaGastosCobranzapxpM'];
        this.interesMoraPendientepxpD = response['interesMoraPendientepxpD'];
        this.gastosCobranzapxpD = response['gastosCobranzapxpD'];
        this.ivaGastosCobranzapxpD = response['ivaGastosCobranzapxpD'];
        this.totalInteresMoraPendientepxp = response['totalInteresMoraPendientepxp'];
        this.totalGastosCobranzapxp = response['totalGastosCobranzapxp'];
        this.totalIvaGastosCobranzapxp = response['totalIvaGastosCobranzapxp'];

        //CREDITOS MOROSOS
        this.diasMora15Pm = response['diasMora15Pm'];
        this.diasMora30Pm = response['diasMora30Pm'];
        this.diasMora60Pm = response['diasMora60Pm'];
        this.diasMora90Pm = response['diasMora90Pm'];
        this.diasMora120Pm = response['diasMora120Pm'];
        this.diasMora180Pm = response['diasMora180Pm'];
        this.diasMora360Pm = response['diasMora360Pm'];
        this.diasMoraMayor360Pm = response['diasMoraMayor360Pm'];
        this.diasMoraPm = response['diasMoraPm'];
        this.diasMora15Pd = response['diasMora15Pd'];
        this.diasMora30Pd = response['diasMora30Pd'];
        this.diasMora60Pd = response['diasMora60Pd'];
        this.diasMora90Pd = response['diasMora90Pd'];
        this.diasMora120Pd = response['diasMora120Pd'];
        this.diasMora180Pd = response['diasMora180Pd'];
        this.diasMora360Pd = response['diasMora360Pd'];
        this.diasMoraMayor360Pd = response['diasMoraMayor360Pd'];
        this.diasMoraPd = response['diasMoraPd'];

        this.totalMora15Pd = response['totalMora15Pd'];
        this.totalMora30Pd = response['totalMora30Pd'];
        this.totalMora60Pd = response['totalMora60Pd'];
        this.totalMora90Pd = response['totalMora90Pd'];
        this.totalMora120Pd = response['totalMora120Pd'];
        this.totalMora180Pd = response['totalMora180Pd'];
        this.totalMora360Pd = response['totalMora360Pd'];
        this.totalMoraMayor360Pd = response['totalMoraMayor360Pd'];
        this.totalMora = response['totalMora'];
        this.totalMoraPm = response['totalMoraPm'];
        this.totalMoraPd = response['totalMoraPd'];
        this.totalDiasMora = response['totalDiasMora'];
        this.totalCreditosMorososPm = response['totalCreditosMorososPm'];
        this.totalCreditosMorososPd = response['totalCreditosMorososPd'];
        this.totalCreditosMorosos = response['totalCreditosMorosos'];

        this.totalMora15 = response['totalMora15'];
        this.totalMora30 = response['totalMora30'];
        this.totalMora60 = response['totalMora60'];
        this.totalMora90 = response['totalMora90'];
        this.totalMora120 = response['totalMora120'];
        this.totalMora180 = response['totalMora180'];
        this.totalMora360 = response['totalMora360'];
        this.totalMoraMayor360 = response['totalMoraMayor360'];
        
        // this.FiltradoService.get(param);
      } else {
        // this.toast.error(JSON.stringify(response));
      }
    });
    // console.log('aqui esta la estadistica',this.cupones$);
  }
  delete(blog: any) {
    const confirm = swal.fire({
      title: `Borrar el cupon  ${blog.nombre} `,
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
        this.FiltradoService.deleteCupon(blog.id).subscribe(response => {
          if (response) {
            this.toast.success(response['message']);
            let param={limit:this.itemsPerPage,offset:this.p};
            this.loadInitialData()
            // this.FiltradoService.get(param);
          } else {
            this.toast.error(JSON.stringify(response));
          }
        });
      }
    });
  }

  onFilter(filterParams) {
    this.filter = filterParams;
    this.loadInitialData();
  }
  
  perPage(itemsPerPage,page){
    this.p = page;
    this.itemsPerPage = itemsPerPage;
    let param
    if(this.filter){
      param={page:this.p,per_page:this.itemsPerPage, ...this.filter};
    }else{
      param={page:this.p,per_page:this.itemsPerPage};
    }
    this.loadInitialData();

  }
}
