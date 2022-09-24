import { Component, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { UsersService } from 'app/shared/services/users.service';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { environment } from "../../../environments/environment";
import { CountryService } from '../../shared/services/country.service';
import { ActivatedRoute, Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {formatCurrency, getCurrencySymbol} from '@angular/common';
@Component({
  selector: 'app-mis-referidos-list',
  templateUrl: './mis-referidos-list.component.html',
  styleUrls: ['./mis-referidos-list.component.scss']
})
export class MisReferidosListComponent implements OnInit {

  users$: Observable<any[]>;
  total = 0;
  p=1;
  usuario
  myId
  isAdmin=false
  itemsPerPage = 5;
  filterParams
  ruta = environment.apiUrl
  closeResult: string;
  constructor(private userService: UsersService, 
    private toast: ToastrService,
    private country:CountryService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,) {
    this.users$ = this.userService.usersMisReferidos$;
 
  }

  ngOnInit() {
    this.admin();
    this.usuario= JSON.parse(localStorage.getItem('user'))
    // let id = this.activatedRoute.snapshot.params.id;
    // if(this.activatedRoute.snapshot.params.id){
    //   this.userService.getMisReferidos(id);
    //   this.myId=id
    // }else{
    //   this.myId=this.usuario.id
    //   this.userService.getMisReferidos(this.usuario.id);
    // }
    
  }
  loadInitialData(params){
    this.usuario= JSON.parse(localStorage.getItem('user'))
    let id = this.activatedRoute.snapshot.params.id;
    if(this.activatedRoute.snapshot.params.id){
      this.userService.getMisReferidos(id,params);
      this.myId=id
    }else{
      this.myId=this.usuario.id
      this.userService.getMisReferidos(this.usuario.id,params);
    }
  }

admin(){

  const roles = localStorage.getItem('roles');
  
  if (roles.trim()=='Administrador') {
    console.log(roles);
    this.isAdmin=true;
  }else{
    this.isAdmin=false;
  }
  

}
  delete(user: any) {
    const confirm = swal.fire({
      title: `Borrar al usuario ${user.first_name} ${user.last_name}`,
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
        this.userService.delete(user.id).subscribe(response => {
          if (response) {
            this.toast.success(response['message']);
            this.p=1;
            let param={page:1,per_page:this.itemsPerPage,...this.filterParams};
            this.loadInitialData(param)
          } else {
            this.toast.error(JSON.stringify(response));
          }
        });
      }
    });
  }
  onFilter(filterParams) {
    console.log(filterParams)
    this.filterParams =filterParams
    this.p=1;
    let param={page:1,per_page:this.itemsPerPage,...filterParams};
    this.loadInitialData(param)
    // this.userService.get(filterParams);
  }
  perPage(itemsPerPage,page){
    this.p = page;
    this.itemsPerPage = itemsPerPage;
    let param={page:this.p,per_page:this.itemsPerPage,...this.filterParams};
    this.loadInitialData(param);

  }
  detallePago(id){
    let params={
      id:id
    };
    this.userService.detallePago(params).subscribe((res)=>{
      console.log(res);
      let fr = JSON.parse(JSON.stringify(res)).financiera_referidor;
      let ur = JSON.parse(JSON.stringify(res)).usuario_referidor;
      let pr = JSON.parse(JSON.stringify(res)).pago_referidor;
      let text= '<div class="row"><div class="col-md-6 col-md-offset-3" style="margin:auto; text-align:left !important;"><label>Nombres y Apellidos: </label><span>'+ur.first_name+' '+ur.last_name+'</span><br><label>Nº cedula: </label><span>'+ur.n_document+'</span><br><label>Email: </label><span>'+ur.email+'</span><br><label>Nombre del banco: </label><span>'+fr.banco+'</span><br><label>Tipo de cuenta: </label><span>'+fr.tipoCuenta+'</span><br><label>Nº de cuenta: </label><span>'+fr.nCuenta+'</span><br><label>Monto a transferir: </label><span>'+formatCurrency(10000, 'en-US', getCurrencySymbol('USD', 'wide'))+'</span><br><label>Metodo de desembolso: </label><span>Transferencia bancaria</span><br><label>Referencia: </label><span>'+pr.referencia+'</span><br><label>Estatus: </label><span>'+pr.estatus+'</span><br><label>Usuario que registro el pago: </label><span>'+pr.registrador+'</span><br><label>Fecha de registro del pago: </label><span>'+pr.updated_at+'</span></div></div>'; 
      const confirm = swal.fire({
        title: "<strong style='color:#fdcb30'>¡Detalle del pago!</strong>",
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
    },(error)=>{
      console.log(error)
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
  creditoMora(){
    let text= '<div class="row"><div class="col-md-6 col-md-offset-3" style="margin:auto; text-align:left !important;"><label>Esta comision no se puede pagar ya que el credito se presenta en mora</label></div></div>'; 
      const confirm = swal.fire({
        title: "<strong style='color:#fdcb30'>¡Detalle del pago!</strong>",
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
  }
}
