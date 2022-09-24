import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { RequestService } from 'app/shared/services/request.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { registerLocaleData, formatNumber } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import * as Moment from 'moment';
import { ConfigCalculadoraService } from 'app/shared/services/config-calculadora.service';

@Component({
  selector: 'app-contra-oferta-list',
  templateUrl: './contra-oferta-list.component.html',
  styleUrls: ['./contra-oferta-list.component.scss']
})
export class ContraOfertaListComponent implements OnInit {
  p=1;
  itemsPerPage = 5;
  contraOfertaForm: FormGroup;
  contraOfertas$: Observable<any[]>;
  usuario
  montoSolicitadoDias:any = 110000;
  plazoDias:any = 15;
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
  plataformaDias:any ;
  ap_expressDias:any;
  ivaDias:any;
  t_interesDias:any;
  subtotalDias:any;
  totalDias:any;
  cant_dias:any = 1
  constructor(private toast: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private requestService: RequestService,
    private configService: ConfigCalculadoraService,) { 
      this.contraOfertaForm = this.fb.group({
        id:['',Validators.required],
        fechaAceptado:['', Validators.required],
        fechaN:[''],
        estatus:['aceptado'],
        m_solicitado: [110000],
        c_mensual: [15],
        tipo:["d"],
        tasa:[],
        subtotal:[],
        plataforma:[],
        aprobacion:[],
        iva:[],
        total_pagar:[],
  
      });
      this.contraOfertas$ = this.requestService.contraOfertas$;
    }

    async ngOnInit() {
      registerLocaleData(localeEs, 'es');
      await this.configDias();
      this.usuario= JSON.parse(localStorage.getItem('user'))
      let param;
      if(this.p)
        { 
          param={
            idUser:this.usuario.id,
            page:this.p,
            per_page:this.itemsPerPage,
            estatus:'rechazado'
          };
        }else{
          param={
            idUser:this.usuario.id,
            page:1,
            per_page:this.itemsPerPage,
            estatus:'rechazado'
          };
        }
      this.loadInitialData(param);
      // this.obtenerCreditos();
  
    }

    loadInitialData(params){
      this.requestService.getContraOfertas(params);

      console.log(this.contraOfertas$);
      this.contraOfertas$.subscribe((res)=>{
        console.log("data",res)
        if(res["data"]){
          let co = res["data"][0];
          console.log("data2",co)
          this.contraOfertaForm.controls['m_solicitado'].setValue(parseInt(co.montoAprobado));
          this.contraOfertaForm.controls['c_mensual'].setValue(parseInt(co.plazo));
          this.contraOfertaForm.controls['id'].setValue(parseInt(co.id));
          this.contraOfertaForm.controls['fechaAceptado'].setValue(Moment().format("YYYY-MM-DD"));
          this.obtenerMonto2();
        }else{
          this.obtenerMonto2();
        }
      })
    }
    configDias(){
      this.configService.getTipo(2).subscribe((res)=>{
        this.configCalDias = res;
        // this.contraOfertaForm.controls['m_solicitado'].setValue(this.configCalDias.monto_minimo);
        // this.contraOfertaForm.controls['c_mensual'].setValue(this.configCalDias.dias_minimo);
        this.plazoDias = (this.configCalDias ? parseInt(this.configCalDias.dias_minimo) : 15);
        this.montoSolicitadoDias = (this.configCalDias ? parseInt(this.configCalDias.monto_minimo) : 175000);
        this.montoRestDias = (this.configCalDias ? parseInt(this.configCalDias.monto_restriccion) : 0);
        this.montoResTooltipDias = (this.configCalDias ? parseInt(this.configCalDias.monto_restriccion_tooltip) : 0);
        this.diasRestDias = (this.configCalDias ? parseInt(this.configCalDias.dias_restriccion) : 0);
        this.tasaDias = (this.configCalDias ? parseFloat(this.configCalDias.tasa) : 0);
        this.porExpressDias = (this.configCalDias ? parseFloat(this.configCalDias.porcentaje_express) : 0);
        this.porIvaDias = (this.configCalDias ? parseFloat(this.configCalDias.porcentaje_iva) : 0);
        this.porplataformaDias = (this.configCalDias ? parseFloat(this.configCalDias.porcentaje_plataforma) : 0);
        
        console.log("CalDias",this.configCalDias);
      },(error)=>{
        console.log(error)
      })
    }
    perPage(itemsPerPage,page){
      this.p = page;
      this.itemsPerPage = itemsPerPage;
      let param={
        idUser:this.usuario.id,
        page:this.p,
        per_page:this.itemsPerPage,
        estatus:'rechazado'
      };
      this.loadInitialData(param);
  
    }

    aprobar() {
      console.log(this.contraOfertaForm.value)
      const confirm = swal.fire({
        title: `¿Desea aprobar la contra oferta?`,
        text: '',
        type: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar',
        focusCancel: true,
        customClass: {
          icon: 'icon-class',
          confirmButton: 'confirm-button-class',
          cancelButton: 'cancel-button-class'
        }
      });
  
      from(confirm).subscribe(r => {
        if (r['value']) {
          // let data = {
          //   id : oferta.id,
          //   estatus: 'aceptado'
          // }
          this.requestService.editarContraOferta(this.contraOfertaForm.value).subscribe(response => {
            if (response) {
              this.toast.success("Contra oferta aprobada");
              // let param={
              //   idUser:this.usuario.id,
              //   page:this.p,
              //   per_page:this.itemsPerPage,
              //   estatus:'rechazado'
              // };;
              // this.loadInitialData(param);
              this.router.navigate(['/credit/approved']);
            } else {
              this.toast.error(JSON.stringify(response));
            }
          });
        }
      });
    }


    setFechaNueva(event){
      var fecha = event.year+'-'+event.month+'-'+event.day;
      this.contraOfertaForm.controls['fechaAceptado'].setValue(Moment(fecha).format("YYYY-MM-DD"));
      console.log(this.contraOfertaForm.value);
    }
  
    editCo(){
      if(this.contraOfertaForm.valid){
        this.requestService.editarContraOferta(this.contraOfertaForm.value).subscribe((res)=>{
          console.log(res)
          this.toast.success("Contra credito aceptado");
          // this.modalService.dismissAll();
          this.router.navigate(['/home']);
  
        },(error)=>{
          console.log(error)
          return false;
        })
      }
    }

    obtenerMonto2(){
      let porPlat = this.porplataformaDias > 0 ? this.porplataformaDias : 1000;
      let porIva = this.porIvaDias > 0 ? this.porIvaDias : 19;
      let tasa = this.tasaDias > 0 ? this.tasaDias : 14;
      let porExp = this.porExpressDias > 0 ? this.porExpressDias : 12.5;
  
      this.plazoDias=this.contraOfertaForm.get('c_mensual').value;
      this.montoSolicitadoDias=this.contraOfertaForm.get('m_solicitado').value;
  
      this.t_interesDias=(Math.round((parseFloat(this.montoSolicitadoDias)*parseFloat(this.plazoDias))*tasa/360))/100
      this.subtotalDias=parseFloat(this.montoSolicitadoDias)+parseFloat(this.t_interesDias);
  
      this.plataformaDias=porPlat*parseFloat(this.plazoDias);
      this.ap_expressDias=parseFloat(this.montoSolicitadoDias)*porExp/100
      this.ivaDias=(parseFloat(this.plataformaDias)+parseFloat(this.ap_expressDias))*porIva/100
      this.totalDias=parseFloat(this.subtotalDias)+parseFloat(this.plataformaDias)+parseFloat(this.ap_expressDias)+parseFloat(this.ivaDias)
  
      this.contraOfertaForm.controls['tasa'].setValue(this.t_interesDias.toFixed(0));
      this.contraOfertaForm.controls['subtotal'].setValue(this.subtotalDias);
      this.contraOfertaForm.controls['plataforma'].setValue(this.plataformaDias);
      this.contraOfertaForm.controls['aprobacion'].setValue(this.ap_expressDias);
      this.contraOfertaForm.controls['iva'].setValue(this.ivaDias);
      this.contraOfertaForm.controls['total_pagar'].setValue(this.totalDias);
    }

}
