import { Component, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { ContactsFormService } from 'app/shared/services/contacts-form.service';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-contacts-form-list',
  templateUrl: './contacts-form-list.component.html',
  styleUrls: ['./contacts-form-list.component.scss']
})
export class ContactsFormListComponent implements OnInit {
  contacts$: Observable<any[]>;
  total = 0;
  p=1;
  itemsPerPage = 5;
  constructor(private contactService: ContactsFormService, private toast: ToastrService) { 
    this.contacts$ = this.contactService.contacts$;
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
    this.contactService.get(params);
    console.log(this.contacts$);
  }

  delete(blog: any) {
    const confirm = swal.fire({
      title: `Borrar la informacion de ${blog.nombreApellidos}`,
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
        this.contactService.delete(blog.id).subscribe(response => {
          if (response) {
            this.toast.success("Eliminado correctamente!");
            this.contactService.get();
          } else {
            this.toast.error("Error inesperado!");
          }
        });
      }
    });
  }

  // joinData(data: string[]): string {
  //   return data.map(o => o['name']).join(', ');
  // }

  onFilter(filterParams) {
    this.contactService.get(filterParams);
  }
  perPage(itemsPerPage,page){
    this.p = page;
    this.itemsPerPage = itemsPerPage;
    let param={page:this.p,per_page:this.itemsPerPage};
    this.loadInitialData(param);

  }
}
