import { Component, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { UsersService } from 'app/shared/services/users.service';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { environment } from "../../../environments/environment";
import { CountryService } from '../../shared/services/country.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as Moment from 'moment';
import {formatCurrency, getCurrencySymbol} from '@angular/common';
import { registerLocaleData, formatNumber } from '@angular/common';
import localeEs from '@angular/common/locales/es';
@Component({
  selector: 'app-gananciasplan',
  templateUrl: './gananciasplan.component.html',
  styleUrls: ['./gananciasplan.component.scss']
})
export class GananciasplanComponent implements OnInit {

  users$: Observable<any[]>;
  total = 0;
  p;
  usuario
  pagado
  pendiente
  referido
  itemsPerPage = '5';
  ruta = environment.apiUrl
  constructor(private userService: UsersService, 
    private toast: ToastrService,
    private country:CountryService,
    private activatedRoute: ActivatedRoute,) {
    this.users$ = this.userService.usersMisReferidos$;
 
  }

  ngOnInit() {
    registerLocaleData(localeEs, 'es');
    this.usuario= JSON.parse(localStorage.getItem('user'))

      this.country.estadisticasReferidor(this.usuario.id).subscribe((res)=>{
        console.log(res);
        this.pagado=JSON.parse(JSON.stringify(res)).totalPagado;
        this.pendiente=JSON.parse(JSON.stringify(res)).totalPendiente;
        this.referido=JSON.parse(JSON.stringify(res)).totalReferidos;
      },(error)=>{
        console.log(error)
      });
    
    
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
            this.userService.get();
          } else {
            this.toast.error(JSON.stringify(response));
          }
        });
      }
    });
  }
  onFilter(filterParams) {
    console.log(filterParams)
    this.userService.get(filterParams);
  }
  

}
