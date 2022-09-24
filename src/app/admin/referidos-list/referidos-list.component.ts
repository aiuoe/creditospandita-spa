import { Component, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { UsersService } from 'app/shared/services/users.service';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { environment } from "../../../environments/environment";
import { CountryService } from '../../shared/services/country.service';

@Component({
  selector: 'app-referidos-list',
  templateUrl: './referidos-list.component.html',
  styleUrls: ['./referidos-list.component.scss']
})
export class ReferidosListComponent implements OnInit {
  users$: Observable<any[]>;
  total = 0;
  p=1;
  itemsPerPage = 5;
  filterParams
  ruta = environment.apiUrl
  constructor(private userService: UsersService, private toast: ToastrService,private country:CountryService) {
    this.users$ = this.userService.usersReferidos$;
 
  }

  ngOnInit() {
    // this.userService.getReferidos();
  }
  loadInitialData(params){
    this.userService.getReferidos(params);
  }

  delete(user: any) {
    const confirm = swal.fire({
      title: `Borrar al usuario ${user.first_name} ${user.last_name}`,
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
        this.userService.delete(user.id).subscribe(response => {
          if (response) {
            this.toast.success(response['message']);
            this.userService.get();
          } else {
            this.toast.error(JSON.stringify(response));
          }
        });
      }
    });
  }

  // joinData(data: string[]): string {
  //   return data.map(o => o['name']).join(', ');
  // }

  onFilter(filterParams) {
    console.log(filterParams)
    this.filterParams = filterParams
    this.p=1;
    let param={page:1,per_page:this.itemsPerPage,...filterParams};
    this.loadInitialData(param)
    // this.userService.get(filterParams);
  }
  
  listanegra(user){
    const confirm = swal.fire({
      title: `Lista negra al usuario ${user.first_name} ${user.last_name}`,
      text: 'Esta acción no se puede deshacer',
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Enviar',
      focusCancel: true
    });

    from(confirm).subscribe(r => {
      if (r['value']) {
        this.userService.listanegra({id:user.id,estatus:'lista negra'}).subscribe(response => {
          if (response) {
            this.toast.success(response['message']);
            this.userService.get();
          } else {
            this.toast.error(JSON.stringify(response));
          }
        });
      }
    });
  }
  perPage(itemsPerPage,page){
    this.p = page;
    this.itemsPerPage = itemsPerPage;
    let param={page:this.p,per_page:this.itemsPerPage,...this.filterParams};
    this.loadInitialData(param);

  }

}
