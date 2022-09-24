import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from "../../../environments/environment";
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.isAuthenticated()) {

        return this.authService.isAuthenticated();
  
      
    } else {
      let ruta = environment.webUrl;
      window.open(ruta, "_self");
      return false;
    }
  }
}
