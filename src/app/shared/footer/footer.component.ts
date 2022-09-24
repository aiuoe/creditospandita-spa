import { Component, HostBinding } from '@angular/core';
import { environment } from "../../../environments/environment";
import { CountryService } from '../../shared/services/country.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})

export class FooterComponent{
    //Variables
    constructor(private country:CountryService){

    }
    rutaStorage = environment.apiBase+"/storage/app/public"
    ruta = environment.webUrl
    currentDate : Date = new Date();

    export(){
        this.country.exportFile();
    }
}
