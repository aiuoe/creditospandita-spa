import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { UserAddComponent } from './user-add/user-add.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UserComponent } from './user/user.component';
import { RoleAdminGuard } from 'app/guards/role-admin.guard';
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogComponent } from './blog/blog.component';
import { ContactsFormListComponent } from './contacts-form-list/contacts-form-list.component';
import { TestimonialListComponent } from './testimonial-list/testimonial-list.component';
import { TestimonialAddComponent } from './testimonial-add/testimonial-add.component';
import { ConfigCalculadoraAddComponent } from './config-calculadora-add/config-calculadora-add.component';
import { ConfigCalculadoraListComponent } from './config-calculadora-list/config-calculadora-list.component';

import { PreguntasComponent } from './preguntas/preguntas.component';
import { PreguntasAddComponent } from './preguntas-add/preguntas-add.component';
import { ParascoreComponent } from './parascore/parascore.component';
import { ParascoreAddComponent } from './parascore-add/parascore-add.component';
import { AtributosComponent } from './atributos/atributos.component';
import { AtributosAddComponent } from './atributos-add/atributos-add.component';
import { VariablesComponent } from './variables/variables.component';
import { VariablesAddComponent } from './variables-add/variables-add.component';
import { FichaComponent } from './ficha/ficha.component';
import { EvaluacionComponent } from './evaluacion/evaluacion.component';
 import { EvaluacionAddComponent } from './evaluacion-add/evaluacion-add.component';
 import { CorreosComponent } from './correos/correos.component';
 import { CorreosAddComponent } from './correos-add/correos-add.component';
 import { UseAddAdminComponent } from './use-add-admin/use-add-admin.component';
 import { ListanegraComponent } from './listanegra/listanegra.component';
 import { ComentariosComponent } from './comentarios/comentarios.component';
 import { UsersListAdminComponent } from './users-list-admin/users-list-admin.component';
 import { ReferidosListComponent } from './referidos-list/referidos-list.component';
 import { MisReferidosListComponent } from './mis-referidos-list/mis-referidos-list.component';
 import { ConfigContraOfertaComponent } from './config-contra-oferta/config-contra-oferta.component';
 import { FichaReferidoComponent } from './ficha-referido/ficha-referido.component';
 import { FiltradoComponent } from './filtrado/filtrado.component';
 import { FiltradoListComponent } from './filtrado-list/filtrado-list.component';
 import { CannonAlojamientoListComponent } from './cannon-alojamiento-list/cannon-alojamiento-list.component';
 import { IngresoActividadListComponent } from './ingreso-actividad-list/ingreso-actividad-list.component';
 import { IngresoActividadAddComponent } from './ingreso-actividad-add/ingreso-actividad-add.component';
 import { CannonAlojamientoAddComponent } from './cannon-alojamiento-add/cannon-alojamiento-add.component';

 import { ConfigContraOfertaListComponent } from './config-contra-oferta-list/config-contra-oferta-list.component';
 import { CreditoprocesoComponent } from './creditoproceso/creditoproceso.component';
 import { DesembolsarComponent } from './desembolsar/desembolsar.component';
 import { CreditoabiertoComponent } from './creditoabierto/creditoabierto.component';
 import { DetalleAbiertoComponent } from './detalle-abierto/detalle-abierto.component';
 import { CreditoCerradoComponent } from './credito-cerrado/credito-cerrado.component';
 import { DetalleCerradoComponent } from './detalle-cerrado/detalle-cerrado.component';
 import { GananciasplanComponent } from './gananciasplan/gananciasplan.component';
 import { PagarReferidoComponent } from './pagar-referido/pagar-referido.component';
 import { CuponesListComponent } from './cupones-list/cupones-list.component';
 import { CuponesComponent } from './cupones/cupones.component';
 import { EstadisticaComponent } from './estadistica/estadistica.component';
import { MorososComponent } from './morosos/morosos.component';
const routes: Routes = [
  {
    path: 'user/add',
    component: UserAddComponent
  },
  {
    path: 'user/add-admin',
    component: UseAddAdminComponent
  },
  {
    path: 'user/edit-admin/:id',
    component: UseAddAdminComponent
  },
  {
    path: 'users/list',
    component: UsersListComponent
  },
  {
    path: 'users/list-referidos',
    component: ReferidosListComponent
  },
  {
    path: 'users/list-mis-referidos/:id',
    component: MisReferidosListComponent
  },
  {
    path: 'users/list-mis-referidos',
    component: MisReferidosListComponent
  },
  {
    path: 'gananciasPlan',
    component: GananciasplanComponent
  },
  {
    path: 'users/list-admin',
    component: UsersListAdminComponent
  },
  {
    path: 'user/:id',
    component: UserComponent
  },
  {
    path: 'user/:id/edit',
    component: UsersComponent
  },
  {
    path: 'blog/add',
    component: BlogComponent
  },
  {
    path: 'blog/list',
    component: BlogListComponent
  },
  {
    path: 'blog/:id',
    component: BlogComponent
  },
  {
    path: 'contacts-form/list',
    component: ContactsFormListComponent
  },
  {
    path: 'testimonial/add',
    component: TestimonialAddComponent
  },
  {
    path: 'testimonial/list',
    component: TestimonialListComponent
  },
  {
    path: 'testimonial/:id',
    component: TestimonialAddComponent
  },
  {
    path: 'config-calculadora/add',
    component: ConfigCalculadoraAddComponent
  },
  {
    path: 'config-calculadora/list',
    component: ConfigCalculadoraListComponent
  },
  {
    path: 'config-calculadora/:id',
    component: ConfigCalculadoraAddComponent
  },
  {
    path: 'config-contra-oferta/:id',
    component: ConfigContraOfertaComponent
  },
  {
    path: '',
    component: UsersListComponent
  },
  {
    path: 'preguntas/list',
    component: PreguntasComponent
  },
  {
    path: 'preguntas/add',
    component: PreguntasAddComponent
  },
  {
    path: 'preguntas/:id',
    component: PreguntasAddComponent
  },
  {
    path: 'parascore/list',
    component: ParascoreComponent
  },
  {
    path: 'parascore/add',
    component: PreguntasAddComponent
  },
  {
    path: 'parascore/:id',
    component: ParascoreAddComponent
  },
  {
    path: 'atributos/list',
    component: AtributosComponent
  },
  {
    path: 'atributos/add',
    component: AtributosAddComponent
  },
  {
    path: 'atributos/:id',
    component: AtributosAddComponent
  },
  {
    path: 'variables/list',
    component: VariablesComponent
  },
  {
    path: 'variables/add',
    component: VariablesAddComponent
  },
  {
    path: 'variables/:id',
    component: VariablesAddComponent
  },
  {
    path: 'ficha/:id',
    component: FichaComponent
  },
  {
    path: 'evaluacion/list',
    component: EvaluacionComponent
  },
  {
    path: 'evaluacion/add',
    component: EvaluacionAddComponent
  },
  {
    path: 'evaluacion/:id',
    component: EvaluacionAddComponent
  },
  {
    path: 'correos/list',
    component: CorreosComponent
  },
  {
    path: 'correos/add',
    component: CorreosAddComponent
  },
  {
    path: 'correos/:id',
    component: CorreosAddComponent
  },
  {
    path: 'blacklist',
    component: ListanegraComponent
  },
  {
    path: 'comentarios',
    component: ComentariosComponent
  },
  {
    path: 'comentarios/:id',
    component: ComentariosComponent
  },
  {
    path: 'comentarioSolicitud/:idSolicitud',
    component: ComentariosComponent
  },
  {
    path: 'comentarios/:evaluacion/:tab',
    component: ComentariosComponent
  },
  {
    path: 'fichaReferido/:id',
    component: FichaReferidoComponent
  },
  {
    path: 'filtrado/add',
    component: FiltradoComponent
  },
  {
    path: 'filtrado/:id',
    component: FiltradoComponent
  },
  {
    path: 'filtrando/list',
    component: FiltradoListComponent
  },
  {
    path: 'cannonAlojamiento/lista',
    component: CannonAlojamientoListComponent
  },
  {
    path: 'cannonAlojamiento/add',
    component: CannonAlojamientoAddComponent
  },
  {
    path: 'cannonAlojamiento/:id',
    component: CannonAlojamientoAddComponent
  },
  {
    path: 'ingreso-actividad/list',
    component: IngresoActividadListComponent
  },
  {
    path: 'ingreso-actividad/add',
    component: IngresoActividadAddComponent
  },
  {
    path: 'ingreso-actividad/:id',
    component: IngresoActividadAddComponent
  },
  {
    path: 'contraofert/list',
    component: ConfigContraOfertaListComponent
  },
  {
    path: 'creditoproceso',
    component: CreditoprocesoComponent
  },
  {
    path: 'desembolsar/:id/:monto',
    component: DesembolsarComponent
  },
  {
    path: 'abiertos',
    component: CreditoabiertoComponent
  },
  {
    path: 'detalle-abiertos/:id',
    component: DetalleAbiertoComponent
  },
  {
    path: 'cerrados',
    component: CreditoCerradoComponent
  },
  {
    path: 'detalle-cerrados/:id',
    component: DetalleCerradoComponent
  },
  {
    path: 'pagar-referido/:idSolicitud/:idUsuario',
    component: PagarReferidoComponent
  },
  {
    path: 'cupones',
    component: CuponesListComponent
  },
  {
    path: 'cupones/add',
    component: CuponesComponent
  },
  {
    path: 'estadistica',
    component: EstadisticaComponent
  },
  {
    path: 'cobranzas/morosos',
    component: MorososComponent
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
