import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { UsersComponent } from './users/users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersListComponent } from './users-list/users-list.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { UserComponent } from './user/user.component';
import { SharedModule } from 'app/shared/shared.module';
import { BlogComponent } from './blog/blog.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
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
import { UserAddComponent } from './user-add/user-add.component';
import { CorreosComponent } from './correos/correos.component';
import { CorreosAddComponent } from './correos-add/correos-add.component';
import { UseAddAdminComponent } from './use-add-admin/use-add-admin.component';
import { ListanegraComponent } from './listanegra/listanegra.component';
import { ComentariosComponent } from './comentarios/comentarios.component';
import { UsersListAdminComponent } from './users-list-admin/users-list-admin.component';
import { ReferidosListComponent } from './referidos-list/referidos-list.component';
import { MisReferidosListComponent } from './mis-referidos-list/mis-referidos-list.component';
import { ConfigContraOfertaComponent } from './config-contra-oferta/config-contra-oferta.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';
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
import { CuponesComponent } from './cupones/cupones.component';
import { CuponesListComponent } from './cupones-list/cupones-list.component';
import { EstadisticaComponent } from './estadistica/estadistica.component';
import { MorososComponent } from './morosos/morosos.component';

@NgModule({
  declarations: [
    UsersComponent,
    UsersListComponent,
    UserComponent,
    BlogComponent,
    BlogListComponent,
    ContactsFormListComponent,
    TestimonialListComponent,
    TestimonialAddComponent,
    ConfigCalculadoraAddComponent,
    ConfigCalculadoraListComponent,
    PreguntasComponent,
    PreguntasAddComponent,
    ParascoreComponent,
    ParascoreAddComponent,
    AtributosComponent,
    AtributosAddComponent,
    VariablesComponent,
    VariablesAddComponent,
    FichaComponent,
    EvaluacionComponent,
    EvaluacionAddComponent,
    UserAddComponent,
    CorreosComponent,
    CorreosAddComponent,
    UseAddAdminComponent,
    ListanegraComponent,
    ComentariosComponent,
    UsersListAdminComponent,
    ReferidosListComponent,
    MisReferidosListComponent,
    ConfigContraOfertaComponent,
    FichaReferidoComponent,
    FiltradoComponent,
    FiltradoListComponent,
    CannonAlojamientoListComponent,
    IngresoActividadListComponent,
    IngresoActividadAddComponent,
    CannonAlojamientoAddComponent,
    ConfigContraOfertaListComponent,
    CreditoprocesoComponent,
    DesembolsarComponent,
    CreditoabiertoComponent,
    DetalleAbiertoComponent,
    CreditoCerradoComponent,
    DetalleCerradoComponent,
    GananciasplanComponent,
    PagarReferidoComponent,
    CuponesComponent,
    CuponesListComponent,
    EstadisticaComponent,
    MorososComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    NgxImageZoomModule.forRoot(),
    ReactiveFormsModule,
    FroalaEditorModule.forRoot(), 
    FroalaViewModule.forRoot(),
    SharedModule,
    SweetAlert2Module.forRoot({
      buttonsStyling: false,
      customClass: 'modal-content',
      confirmButtonClass: 'btn btn-primary',
      cancelButtonClass: 'btn'
    })
  ]
})
export class AdminModule {}
