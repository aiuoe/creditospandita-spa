import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import {ReactiveFormsModule } from '@angular/forms';
import { ReferenciaComponent } from './referencia/referencia.component';
import { FinancieraComponent } from './financiera/financiera.component';
import { SharedModule } from 'app/shared/shared.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
@NgModule({
  declarations: [HomeComponent, ReferenciaComponent, FinancieraComponent],
  imports: [CommonModule, HomeRoutingModule,ReactiveFormsModule, SharedModule,NgMultiSelectDropDownModule.forRoot()],
  
})
export class HomeModule {}
