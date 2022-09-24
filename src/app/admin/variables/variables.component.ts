import { Component, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { VariablesService } from 'app/shared/services/variables.service';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-variables',
  templateUrl: './variables.component.html',
  styleUrls: ['./variables.component.scss']
})
export class VariablesComponent implements OnInit {

  blogs$: Observable<any[]>;
  total = 0;
  p=0;
  itemsPerPage = 5;
  constructor(private VariablesService: VariablesService, private toast: ToastrService) {
    this.blogs$ = this.VariablesService.blogs$;
   }

  ngOnInit() {
    let param={limit:this.itemsPerPage,offset:this.p};
    this.VariablesService.get(param);
    console.log(this.blogs$)
  }

  delete(blog: any) {
    const confirm = swal.fire({
      title: `Borrar la variable ${blog.variable}`,
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
        this.VariablesService.delete(blog.id).subscribe(response => {
          if (response) {
            this.toast.success(response['message']);
            let param={limit:this.itemsPerPage,offset:this.p};
            this.VariablesService.get(param);
          } else {
            this.toast.error(JSON.stringify(response));
          }
        });
      }
    });
  }

  onFilter(filterParams) {
    this.VariablesService.get(filterParams);
  }
  
  perPage(pItemsInPage,page){
    console.log(page)
    this.itemsPerPage = pItemsInPage;
    this.p = page;
    let p = (page - 1) * pItemsInPage;
    console.log(p)
    let param={limit:this.itemsPerPage,offset:p}; 
    this.VariablesService.get(param);

  }


}
