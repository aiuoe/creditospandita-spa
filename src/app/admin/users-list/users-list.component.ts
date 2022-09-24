import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, from } from 'rxjs';
import { UsersService } from 'app/shared/services/users.service';
import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { environment } from "../../../environments/environment";
import { CountryService } from '../../shared/services/country.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EvaluacionService } from 'app/shared/services/evaluacion.service';
@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  @ViewChild('approve') modalApprove: ElementRef
  @ViewChild('approveVerifiquese') modalApproveVerifiquese: ElementRef
  users$: Observable<any[]>;
  total = 0;
  p=1;
  itemsPerPage = 5;
  filterParams
  ruta = environment.apiUrl
  closeResult: string;
  divicion
  descargaExcel =0
  arrExcel=[]
  external_evaluacion_id: number;
  external: boolean = false;

  statusEval: string = 'pendiente_manual';
  userSelected
  modalTitle: string;
  typeApprove: string;
  evaluationSelected: any;
  validations_form: FormGroup;
  validations_verifiquese: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  validation_messages = {
    'result': [
     { type: 'required', message: 'Este campo es obligatorio.' },
    ],
    'bdua': [
     { type: 'required', message: 'Este campo es obligatorio.' },
    ],
    'ofac': [
     { type: 'required', message: 'Este campo es obligatorio.' },
    ],
    'estadoCedula': [
     { type: 'required', message: 'Este campo es obligatorio.' },
    ],
    'antecedentes': [
     { type: 'required', message: 'Este campo es obligatorio.' },
    ],
    
  };
  constructor(private userService: UsersService, private toast: ToastrService,private country:CountryService,
    private modalService: NgbModal, 
    private formBuilder: FormBuilder,
    private evaluacionService: EvaluacionService,
    ) {
    this.users$ = this.userService.users$;
    // this.users$.subscribe(users => {
    //   if (users) {
    //     this.total = users.length;
    //   }
      
    // });
 
  }

  ngOnInit() {
    this.validations();
    // this.userService.get();
    this.users$.subscribe((res)=>{
      if(res){
        this.total = JSON.parse(JSON.stringify(res)).total
        this.divicion = this.total/1000
        let a = {name:'1-1000',value:0}
        let i = 0
        let inicio
        let fin
        let name
        for (let index = 0; index < this.divicion; index++) {
          i=index+1
          if(i == 1){
            inicio = 0
            fin = 1000
            
          }else if(i > 1){
            inicio = fin
            fin = fin+1000
          }
          name= inicio+'-'+fin
          
          this.arrExcel.push({name:name,value:inicio})
          
        }
        console.log("TT",this.arrExcel)
      }
      console.log(this.users$['value'].data);
      
    })
  }
  loadInitialData(params){
    this.userService.get(params);
  }
  export(){
    console.log(this.descargaExcel)
    this.country.exportFileUser(this.descargaExcel);
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
    this.filterParams =filterParams
    this.p=1;
    this.filterParams.status_evaluation = this.statusEval;
    let param={page:1,per_page:this.itemsPerPage,...filterParams};
    console.log(this.filterParams)
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

  open(content) {
    this.modalService.open(content).result.then((result) => {
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

  setExternalEvaluacionId(id){
    
    this.external = false;
    let sidebar = document.getElementById('menu23');
    let fondo = document.getElementById('fondo');
    fondo.classList.remove('main-content');
    sidebar.style.display = 'none';
    setTimeout(() => {
      this.external_evaluacion_id = id;
      this.external = true;
    }, 100);
  }

  closeExternal(param){
    let sidebar = document.getElementById('menu23');
    sidebar.style.display = 'block';
    let fondo = document.getElementById('fondo');
    fondo.classList.add('main-content');
    this.external = param;
  }

  openApprove(content, user){

    this.evaluationSelected = user.LastSolicitud.Evaluacion;
    this.userSelected = user;

    this.modalTitle = "email: "+user.email;
    this.typeApprove = 'email';
    this.modalService.open(this.modalApprove, {centered: true, size: 'lg', backdrop: 'static'}).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  approveMethodEmail(form, status){
    this.validations();
    let params = {
      status: status,
      evaluation_id:  this.evaluationSelected.id,
      ...form
    }

    this.evaluacionService.manualApproveEmail(params).subscribe(res => {

      if(status){
        let params = {
          id: this.userSelected.id,
          tiempoReporteMeses: 0,
          idSolicitud: this.userSelected.LastSolicitud.id,
          inicioAnalisis: "verifiquese"
        }
        this.evaluacionService.approveVerifiquese(params).subscribe(arg => {
          this.toast.success(res['message']);
          this.modalService.dismissAll();
          this.perPage(this.itemsPerPage, this.p);
        });
        
      }
      this.toast.success(res['message']);
      this.modalService.dismissAll();
      this.perPage(this.itemsPerPage, this.p);
    });
  }

  validations(){
    this.validations_form = this.formBuilder.group({
      result: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    });

    this.validations_verifiquese = this.formBuilder.group({
      bdua: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      ofac: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      estadoCedula: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      antecedentes: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    });

  }

  openApproveVerifiquese(modal, user){
    this.validations();
    this.evaluationSelected = user.LastSolicitud.Evaluacion;
    
    this.modalTitle = 'verifiquese: ' + user.n_document;
    this.modalService.open(this.modalApproveVerifiquese, {centered: true, size: 'lg', backdrop: 'static'}).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  approveMethodVerifiquese(form, status){

    let params = {
      status: status,
      evaluation_id:  this.evaluationSelected.id,
      idSolicitud: this.evaluationSelected.idSolicitudFk,
      idUser: this.evaluationSelected.idUserFk,
      ...form
    }

    this.evaluacionService.manualApproveVerifiquese(params).subscribe(res => {
      this.toast.success(res['message']);
      this.modalService.dismissAll();
      this.perPage(this.itemsPerPage, this.p);
    });    

  }

  cambioestatus(params){
    this.statusEval = params
    this.filterParams.status_evaluation = this.statusEval;
    let param={page:this.p,per_page:this.itemsPerPage,...this.filterParams};
    this.loadInitialData(param);
  }

  openExternalModal(params){
    if (params[0] == 'approve') {
      
      this.openApprove(params[0], params[1]);
    }else{
      this.openApproveVerifiquese(params[0], params[1]);

    }
  }
}
