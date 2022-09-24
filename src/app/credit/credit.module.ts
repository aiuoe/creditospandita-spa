import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreditRoutingModule } from './credit-routing.module';
import { NewRequestComponent } from './new-request/new-request.component';
import { PreApprovedComponent } from './pre-approved/pre-approved.component';
import { ApprovedComponent } from './approved/approved.component';
import { PaidComponent } from './paid/paid.component';
import { SolicitudfisicaComponent } from './solicitudfisica/solicitudfisica.component';
import { CreditHistoryComponent } from './credit-history/credit-history.component';
import { NovacionComponent } from './novacion/novacion.component';
import { ContraOfertaListComponent } from './contra-oferta-list/contra-oferta-list.component';
import { DisbursedComponent } from './disbursed/disbursed.component';
import { ReferidoComponent } from './referido/referido.component';

@NgModule({
  declarations: [NewRequestComponent, PreApprovedComponent, ApprovedComponent, PaidComponent, SolicitudfisicaComponent, NovacionComponent, CreditHistoryComponent, ContraOfertaListComponent, DisbursedComponent, ReferidoComponent],
  imports: [
    CommonModule,
    CreditRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    SweetAlert2Module.forRoot({
      buttonsStyling: false,
      customClass: 'modal-content',
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
    })
  ]
})
export class CreditModule { }
