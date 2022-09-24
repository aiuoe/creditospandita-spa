import { Component, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { ConfigCalculadoraService } from 'app/shared/services/config-calculadora.service';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
@Component({
  selector: 'app-cannon-alojamiento-list',
  templateUrl: './cannon-alojamiento-list.component.html',
  styleUrls: ['./cannon-alojamiento-list.component.scss']
})
export class CannonAlojamientoListComponent implements OnInit {
  pItemsInPage=5
  p=1
  configuraciones$: Observable<any[]>;
  constructor(private configService: ConfigCalculadoraService, 
    private toast: ToastrService) { 
      this.configuraciones$ = this.configService.configuracionesCannon$;
    }

    ngOnInit() {
      registerLocaleData(localeEs, 'es');
      let param;
      if(this.p)
        { 
          param={page:this.p,per_page:this.pItemsInPage};
        }else{
          param={page:1,per_page:this.pItemsInPage};
        }
      this.loadInitialData(param);
    }
  
    loadInitialData(params){
      this.configService.getCannon(params);
      console.log(this.configuraciones$);
    }
   delete(configuracion: any) {
      const confirm = swal.fire({
        title: `Borrar la configuracion`,
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
          this.configService.deleteCannon(configuracion.id).subscribe(response => {
            if (response) {
              this.toast.success("Dato eliminado con exito!");
              this.loadInitialData({page:this.p,per_page:this.pItemsInPage})
            } else {
              this.toast.error("Error inesperado!");
            }
          });
        }
      });
    }
    perPage(pItemsInPage,page){
      this.p = page;
      this.pItemsInPage = pItemsInPage;
      let param={page:this.p,per_page:this.pItemsInPage};
      this.loadInitialData(param);
  
    }

}
