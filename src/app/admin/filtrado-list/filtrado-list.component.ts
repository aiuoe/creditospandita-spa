import { Component, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { FiltradoService } from 'app/shared/services/filtrado.service';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-filtrado-list',
  templateUrl: './filtrado-list.component.html',
  styleUrls: ['./filtrado-list.component.scss']
})
export class FiltradoListComponent implements OnInit {

  blogs$: Observable<any[]>;
  total = 0;
  p=1;
  itemsPerPage = 5;
  filter: any = ''
  constructor(private FiltradoService: FiltradoService, private toast: ToastrService) {
    this.blogs$ = this.FiltradoService.blogs$;
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
    this.FiltradoService.get(params);
    console.log(this.blogs$);
  }
  delete(blog: any) {
    const confirm = swal.fire({
      title: `Borrar el filtro ${blog.variable}`,
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
        this.FiltradoService.delete(blog.id).subscribe(response => {
          if (response) {
            this.toast.success(response['message']);
            let param={limit:this.itemsPerPage,offset:this.p};
            this.FiltradoService.get(param);
          } else {
            this.toast.error(JSON.stringify(response));
          }
        });
      }
    });
  }

  onFilter(filterParams) {
    this.filter = filterParams;
    this.loadInitialData({page:1,per_page:this.itemsPerPage,...filterParams});

  }
  
  perPage(itemsPerPage,page){
    this.p = page;
    this.itemsPerPage = itemsPerPage;
    let param
    if(this.filter){
      param={page:this.p,per_page:this.itemsPerPage, ...this.filter};
    }else{
      param={page:this.p,per_page:this.itemsPerPage};
    }
    this.loadInitialData(param);

  }


}
