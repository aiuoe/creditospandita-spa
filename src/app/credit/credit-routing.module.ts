import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewRequestComponent } from './new-request/new-request.component';
import { PreApprovedComponent } from './pre-approved/pre-approved.component';
import { ApprovedComponent } from './approved/approved.component';
import { PaidComponent } from './paid/paid.component';
import { NovacionComponent } from './novacion/novacion.component';
import { SolicitudfisicaComponent } from './solicitudfisica/solicitudfisica.component';
import { CreditHistoryComponent } from './credit-history/credit-history.component';
import { ContraOfertaListComponent } from './contra-oferta-list/contra-oferta-list.component';
import { DisbursedComponent } from './disbursed/disbursed.component';
import { ReferidoComponent } from './referido/referido.component';
const routes: Routes = [
  {
    path: 'new-request',
    component: NewRequestComponent
  },
  {
    path: 'pre-approved',
    component: PreApprovedComponent
  },
  {
    path: 'contra-ofertas',
    component: ContraOfertaListComponent
  },
  {
    path: 'approved',
    component: ApprovedComponent
  },
  {
    path: 'disbursed',
    component: DisbursedComponent
  },
  {
    path: 'paid',
    component: PaidComponent
  },
  {
    path: 'solicitudfisica',
    component: SolicitudfisicaComponent
  },
  {
    path: 'creditHistory/:id',
    component: CreditHistoryComponent
  },
  {
    path: 'creditHistory',
    component: CreditHistoryComponent
  },
  {
    path: 'novacion/:id',
    component: NovacionComponent
  },
  // {
  //   path: 'novacion',
  //   component: NovacionComponent
  // },
  {
    path: 'referido',
    component: ReferidoComponent
  },

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditRoutingModule { }
