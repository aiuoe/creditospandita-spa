import { Component, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { UsersService } from 'app/shared/services/users.service';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-listanegra',
  templateUrl: './listanegra.component.html',
  styleUrls: ['./listanegra.component.scss']
})
export class ListanegraComponent implements OnInit {

  users2$: Observable<any[]>;
  total = 0;
  p=1;
  itemsPerPage = 5;
  filterParams
  constructor(private userService: UsersService, private toast: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,) {
    this.users2$ = this.userService.users$;
    // this.users2$.subscribe(users => {
    //   if (users) {
    //     this.total = users.length;
    //   }
      
    // });
 
  }

  ngOnInit() {
    // this.userService.getListanegra();
  }
  loadInitialData(params){
    this.userService.getListanegra(params);
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
            this.p=1;
            let param={page:1,per_page:this.itemsPerPage,...this.filterParams};
            this.loadInitialData(param)
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
    this.filterParams =filterParams
    this.p=1;
    let param={page:1,per_page:this.itemsPerPage,...filterParams};
    this.loadInitialData(param)
    // this.userService.get(filterParams);
  }
  perPage(itemsPerPage,page){
    this.p = page;
    this.itemsPerPage = itemsPerPage;
    let param={page:this.p,per_page:this.itemsPerPage,...this.filterParams};
    this.loadInitialData(param);

  }
  activar(user){
    const confirm = swal.fire({
      title: `Activar usuario ${user.first_name} ${user.last_name}`,
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
        this.userService.listanegra({id:user.id,estatus:'activo'}).subscribe(response => {
          if (response) {
            this.toast.success(response['message']);
            this.router.navigate(['/admin/users/list']);

          } else {
            this.toast.error(JSON.stringify(response));
          }
        });
      }
    });
  }

}
