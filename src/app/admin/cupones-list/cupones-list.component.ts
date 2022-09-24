import { Component, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { FiltradoService } from 'app/shared/services/filtrado.service';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cupones-list',
  templateUrl: './cupones-list.component.html',
  styleUrls: ['./cupones-list.component.scss']
})
export class CuponesListComponent implements OnInit {

  cupones$: Observable<any[]>;
  total = 0;
  p=1;
  itemsPerPage = 5;
  filter: any = ''
  constructor(private FiltradoService: FiltradoService, private toast: ToastrService) {
    this.cupones$ = this.FiltradoService.cupones$;
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
    this.FiltradoService.getCupones(params);
    console.log(this.cupones$);
  }
  delete(blog: any) {
    const confirm = swal.fire({
      title: `Borrar el cupon  ${blog.nombre} `,
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
        this.FiltradoService.deleteCupon(blog.id).subscribe(response => {
          if (response) {
            this.toast.success(response['message']);
            let param={limit:this.itemsPerPage,offset:this.p};
            this.loadInitialData(param)
            // this.FiltradoService.get(param);
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
