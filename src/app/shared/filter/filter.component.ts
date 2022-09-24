import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as Moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import {
  throttleTime,
  debounce,
  debounceTime,
  distinctUntilChanged
} from 'rxjs/operators';

interface Filter {
  text: string;
  until: string;
  since: string;
}

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Output() onFilter: EventEmitter<Partial<Filter>> = new EventEmitter<
    Partial<Filter>
  >();

  formFilter: FormGroup;
  until;
  since;
  searchName
  searchText$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  constructor(private fb: FormBuilder) {
    this.formFilter = this.fb.group({
      search: [''],
      until: [''],
      since: ['']
    });

    this.formFilter.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe(value => {
//         const valuesParsed = {};
//         let count = 0; // Sirve para evitar la doble consulta inicial
//         Object.keys(value).forEach(v => {
//           if (value[v]) {
//             count++;
//             valuesParsed[v] = value[v];
//           }
//         });
// console.log(count)
//         /**
//          * En caso de que el formulario esté vacío en su totalidad
//          * no se emite evento para así evitar doble request
//          */
//         // if (count > 0) {
//           this.onFilter.emit(valuesParsed);
//         // }
      });

    // this.searchText$
    //   .pipe(
    //     debounceTime(600),
    //     distinctUntilChanged()
    //   )
    //   .subscribe(inputText => {
    //     this.formFilter.controls['search'].setValue(inputText);
    //   });
  }

  ngOnInit() {
    this.reset();
  }

  // set until(value) {
  //   if (value) {
  //     this.formFilter.controls['until'].setValue(
  //       Moment(value).format('YYYY-MM-DD')
  //     );
  //   }
  // }

  // set since(value) {
  //   if (value) {
  //     this.formFilter.controls['since'].setValue(
  //       Moment(value).format('YYYY-MM-DD')
  //     );
  //   }
  // }

  setSearchName() {
    if (this.searchName || this.until || this.since) {
      console.log('variable until',this.until)
      // this.searchText$.next(this.searchName);

      if(this.until && this.since){
        this.formFilter.controls['until'].setValue(Moment(this.until).format('YYYY-MM-DD'));
        this.formFilter.controls['since'].setValue(Moment(this.since).format('YYYY-MM-DD'));
      }

      this.formFilter.controls['search'].setValue(this.searchName);
      const valuesParsed = {};
      let formulario=this.formFilter.value
      let count = 0; // Sirve para evitar la doble consulta inicial
      Object.keys(formulario).forEach(v => {
        if (formulario[v]) {
          count++;
          valuesParsed[v] = formulario[v];
        }
      });
console.log(count)
      /**
       * En caso de que el formulario esté vacío en su totalidad
       * no se emite evento para así evitar doble request
       */
      // if (count > 0) {
        this.onFilter.emit(valuesParsed);
      // }
      
    }else{
      // this.searchText$.next(this.searchName);
      
      this.onFilter.emit({});
    }
  }

  reset() {
    this.searchName='';
    this.until='';
    this.since='';
    // console.log("BUS=>",this.searchName)
    this.formFilter.reset();
    this.onFilter.emit({});

  }

}
