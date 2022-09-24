import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as Moment from 'moment';

@Component({
  selector: 'app-filter-type',
  templateUrl: './filter-type.component.html',
  styleUrls: ['./filter-type.component.scss']
})

export class FilterTypeComponent implements OnInit {
  @Output() onFilter: EventEmitter<any> = new EventEmitter();

  until;
  since;
  typeFilter = 'actualMonth';
  constructor(private fb: FormBuilder) {

  }

  ngOnInit() {
    this.setFilter();
  }

  setFilter(){
    let filters;
    if(this.typeFilter === 'actualMonth'){
      filters = {
        until: Moment().format('YYYY-MM'),
        since: Moment().format('YYYY-MM'),
        typeFilter: this.typeFilter
      }
    }else{
      filters = {
        until: Moment(this.until).format('YYYY-MM-DD'),
        since: Moment(this.since).format('YYYY-MM-DD'),
        typeFilter: this.typeFilter
      }
    }
    this.onFilter.emit(filters);
  }

}
