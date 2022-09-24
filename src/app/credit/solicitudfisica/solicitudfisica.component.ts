import { Component, OnInit } from '@angular/core';
import { CountryService } from '../../shared/services/country.service';
@Component({
  selector: 'app-solicitudfisica',
  templateUrl: './solicitudfisica.component.html',
  styleUrls: ['./solicitudfisica.component.scss']
})
export class SolicitudfisicaComponent implements OnInit {

  constructor(
    private countriesService: CountryService
  ) { }

  ngOnInit() {
    this.countriesService.exportFile()
  }

}
