import { Component, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { ParascoreService } from 'app/shared/services/parascore.service';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-parascore',
  templateUrl: './parascore.component.html',
  styleUrls: ['./parascore.component.scss']
})
export class ParascoreComponent implements OnInit {

  blogs$: Observable<any[]>;
  total = 0;
  p=0;
  itemsPerPage = 5;
  constructor(private ParascoreService: ParascoreService, private toast: ToastrService) {
    this.blogs$ = this.ParascoreService.blogs$;
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
    this.ParascoreService.get(params);
    console.log(this.blogs$);
  }

  delete(blog: any) {
    const confirm = swal.fire({
      title: `Borrar la pregunta ${blog.titulo}`,
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
        this.ParascoreService.delete(blog.id).subscribe(response => {
          if (response) {
            this.toast.success(response['message']);
            let param={limit:this.itemsPerPage,offset:this.p};
            this.ParascoreService.get(param);
          } else {
            this.toast.error(JSON.stringify(response));
          }
        });
      }
    });
  }

  onFilter(filterParams) {
    this.ParascoreService.get(filterParams);
  }
  
  perPage(itemsPerPage,page){
    this.p = page;
    this.itemsPerPage = itemsPerPage;
    let param={page:this.p,per_page:this.itemsPerPage};
    this.loadInitialData(param);

  }
}
