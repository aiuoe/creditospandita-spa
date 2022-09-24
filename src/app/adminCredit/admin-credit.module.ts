import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminCreditRoutingModule } from './admin-credit-routing.module';
import { AdminCreditComponent } from './admin-credit/admin-credit.component';
import { AdicionalComponent } from './adicional/adicional.component';
import { AdicionalListComponent } from './adicional-list/adicional-list.component';
@NgModule({
  declarations: [AdminCreditComponent,AdicionalComponent,AdicionalListComponent],
  imports: [
    CommonModule,
    AdminCreditRoutingModule,
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
export class AdminCreditModule { }
