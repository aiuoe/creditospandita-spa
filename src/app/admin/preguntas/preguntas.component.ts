import { Component, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { AskService } from 'app/shared/services/ask.service';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-preguntas',
  templateUrl: './preguntas.component.html',
  styleUrls: ['./preguntas.component.scss']
})
export class PreguntasComponent implements OnInit {

  blogs$: Observable<any[]>;
  total = 0;
  p=0;
  itemsPerPage = 5;
  constructor(private AskService: AskService, private toast: ToastrService) {
    this.blogs$ = this.AskService.blogs$;
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
    this.AskService.get(params);
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
        this.AskService.delete(blog.id).subscribe(response => {
          if (response) {
            this.toast.success(response['message']);
            let param={limit:this.itemsPerPage,offset:this.p};
            this.AskService.get(param);
          } else {
            this.toast.error(JSON.stringify(response));
          }
        });
      }
    });
  }

  onFilter(filterParams) {
    this.AskService.get(filterParams);
  }
  
  perPage(itemsPerPage,page){
    this.p = page;
    this.itemsPerPage = itemsPerPage;
    let param={page:this.p,per_page:this.itemsPerPage};
    this.loadInitialData(param);

  }

}
