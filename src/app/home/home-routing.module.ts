import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { ReferenciaComponent } from './referencia/referencia.component';
import { FinancieraComponent } from './financiera/financiera.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: ':id',
    component: HomeComponent
  },
  {
    path: 'crear/:creat/:id',
    component: HomeComponent
  },
  {
    path: 'referencia/list',
    component: ReferenciaComponent
  },
  {
    path: 'financiera/list',
    component: FinancieraComponent
  },
  {
    path: 'referencia/list/:id',
    component: ReferenciaComponent
  },
  {
    path: 'financiera/list/:id',
    component: FinancieraComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
