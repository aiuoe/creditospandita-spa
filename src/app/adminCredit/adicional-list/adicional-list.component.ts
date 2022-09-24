import { Component, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { AdicionalService } from 'app/shared/services/adicional.service';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { environment } from "../../../environments/environment";
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-adicional-list',
  templateUrl: './adicional-list.component.html',
  styleUrls: ['./adicional-list.component.scss']
})
export class AdicionalListComponent implements OnInit {

  blogs$: Observable<any[]>;
  total = 0;
  userLog
  p =1;
  urlImagen
  ruta = environment.apiBase+"/storage/app/public/"
  itemsPerPage = 5;
  closeResult: string;
  constructor(private AdicionalService: AdicionalService, 
    private modalService: NgbModal,
    private _modalService: NgbModal,
    private toast: ToastrService) {
    this.blogs$ = this.AdicionalService.blogs$;
   }

   ngOnInit() {
    let param;
    this.userLog = JSON.parse(localStorage.getItem('user')).id;
    if(this.p)
      { 
        param={page:this.p,per_page:this.itemsPerPage,id:this.userLog};
      }else{
        param={page:1,per_page:this.itemsPerPage,id:this.userLog};
      }
    this.loadInitialData(param);
  }
  loadInitialData(params){
    this.AdicionalService.get(params);
    console.log(this.blogs$);
  }

  delete(testimonial: any) {
    const confirm = swal.fire({
      title: `Borrar el archivo ${testimonial.nombre}`,
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
        this.AdicionalService.delete(testimonial.id).subscribe(response => {
          if (response) {
            this.toast.success("Dato eliminado con exito!");
            let param;
            if(this.p)
              { 
                param={page:this.p,per_page:this.itemsPerPage,id:this.userLog};
              }else{
                param={page:1,per_page:this.itemsPerPage,id:this.userLog};
              }
              this.loadInitialData(param);
         
          } else {
            this.toast.error("Error inesperado!");
          }
        });
      }
    });
  }

  onFilter(filterParams) {
    this.AdicionalService.get(filterParams);
  }
  perPage(itemsPerPage,page){
    this.p = page;
    this.itemsPerPage = itemsPerPage;
    let param={page:this.p,per_page:this.itemsPerPage};
    this.loadInitialData(param);

  }

  open(content) {
    this.modalService.open(content, { size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  export(nombre){
    let data = {
      file:nombre
    }
    this.AdicionalService.exportFile(data);
  }

}
