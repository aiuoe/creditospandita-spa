import { Component, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { CorreosService } from 'app/shared/services/correos.service';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-correos',
  templateUrl: './correos.component.html',
  styleUrls: ['./correos.component.scss']
})
export class CorreosComponent implements OnInit {

  testimoniales$: Observable<any[]>;
  total = 0;
  p =1;
  itemsPerPage = 5;
  constructor(private CorreosService: CorreosService, private toast: ToastrService) {
    this.testimoniales$ = this.CorreosService.testimoniales$;
   }

   ngOnInit() {
    let param;
    if(this.p)
      { 
        param={page:this.p,per_page:this.itemsPerPage};
      }else{
        param={page:1,per_page:this.itemsPerPage};
      }
    this.loadInitialData(param);
  }
  loadInitialData(params){
    this.CorreosService.get(params);
    console.log(this.testimoniales$);
  }

  delete(testimonial: any) {
    const confirm = swal.fire({
      title: `Borrar el testimonial ${testimonial.email}`,
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
        this.CorreosService.delete(testimonial.id).subscribe(response => {
          if (response) {
            this.toast.success("Dato eliminado con exito!");
            this.CorreosService.get();
          } else {
            this.toast.error("Error inesperado!");
          }
        });
      }
    });
  }

  onFilter(filterParams) {
    this.CorreosService.get(filterParams);
  }
  perPage(itemsPerPage,page){
    this.p = page;
    this.itemsPerPage = itemsPerPage;
    let param={page:this.p,per_page:this.itemsPerPage};
    this.loadInitialData(param);

  }

  activar(testimonial: any) {
    const confirm = swal.fire({
      title: `Desean activar el template ${testimonial.pertenece}`,
      text: 'Esta acción no se puede deshacer',
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Activar',
      focusCancel: true
    });

    from(confirm).subscribe(r => {
      if (r['value']) {
        this.CorreosService.cambioEstatus({id:testimonial.id,estatus:'activo'}).subscribe(response => {
          if (response) {
            this.toast.success("Activado con exito!");
            this.CorreosService.get();
          } else {
            this.toast.error("Error inesperado!");
          }
        });
      }
    });
  }

  desactivar(testimonial: any) {
    const confirm = swal.fire({
      title: `Desean desactivar el template ${testimonial.pertenece}`,
      text: 'Esta acción no se puede deshacer',
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Desactivar',
      focusCancel: true
    });

    from(confirm).subscribe(r => {
      if (r['value']) {
        this.CorreosService.cambioEstatus({id:testimonial.id,estatus:'inactivo'}).subscribe(response => {
          if (response) {
            this.toast.success("Desactivado con exito!");
            this.CorreosService.get();
          } else {
            this.toast.error("Error inesperado!");
          }
        });
      }
    });
  }



}
