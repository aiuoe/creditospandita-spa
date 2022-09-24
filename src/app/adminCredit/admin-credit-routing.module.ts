import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminCreditComponent } from './admin-credit/admin-credit.component';
import { AdicionalComponent } from './adicional/adicional.component';
import { AdicionalListComponent } from './adicional-list/adicional-list.component';
const routes: Routes = [
  {
    path: ':id',
    component: AdminCreditComponent
  },
  {
    path: 'adicional/add',
    component: AdicionalComponent
  },
  {
    path: 'adicional/list',
    component: AdicionalListComponent
  },
  {
    path: ':id/:novacion',
    component: AdminCreditComponent
  },
  

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminCreditRoutingModule { }
