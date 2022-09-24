import { Component, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { AtributosService } from 'app/shared/services/atributos.service';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-atributos',
  templateUrl: './atributos.component.html',
  styleUrls: ['./atributos.component.scss']
})
export class AtributosComponent implements OnInit {

  blogs$: Observable<any[]>;
  total = 0;
  p=1;
  itemsPerPage = 5;
  filter: any = ''
  constructor(private AtributosService: AtributosService, private toast: ToastrService) {
    this.blogs$ = this.AtributosService.blogs$;
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
    this.AtributosService.get(params);
    console.log(this.blogs$);
  }
  delete(blog: any) {
    const confirm = swal.fire({
      title: `Borrar la pregunta ${blog.variable}`,
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
        this.AtributosService.delete(blog.id).subscribe(response => {
          if (response) {
            this.toast.success(response['message']);
            let param={limit:this.itemsPerPage,offset:this.p};
            this.AtributosService.get(param);
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
