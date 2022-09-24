import { Component, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { TestimonialService } from 'app/shared/services/testimonial.service';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-testimonial-list',
  templateUrl: './testimonial-list.component.html',
  styleUrls: ['./testimonial-list.component.scss']
})
export class TestimonialListComponent implements OnInit {
  testimoniales$: Observable<any[]>;
  total = 0;
  p =1;
  itemsPerPage = 5;
  constructor(private testimonialService: TestimonialService, private toast: ToastrService) {
    this.testimoniales$ = this.testimonialService.testimoniales$;
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
    this.testimonialService.get(params);
    console.log(this.testimoniales$);
  }

  delete(testimonial: any) {
    const confirm = swal.fire({
      title: `Borrar el testimonial ${testimonial.nombres}`,
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
        this.testimonialService.delete(testimonial.id).subscribe(response => {
          if (response) {
            this.toast.success("Dato eliminado con exito!");
            this.testimonialService.get();
          } else {
            this.toast.error("Error inesperado!");
          }
        });
      }
    });
  }

  onFilter(filterParams) {
    this.testimonialService.get(filterParams);
  }
  perPage(itemsPerPage,page){
    this.p = page;
    this.itemsPerPage = itemsPerPage;
    let param={page:this.p,per_page:this.itemsPerPage};
    this.loadInitialData(param);

  }
}
