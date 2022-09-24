import { Injectable } from '@angular/core';
import { 
  Router,
  CanActivate,
  ActivatedRouteSnapshot
} from '@angular/router';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {
  roles$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  token: string;
  constructor(public auth: AuthService, public router: Router) { 
    this.token = localStorage.getItem('token');
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // this will be passed from the route config
    // on the data property
    const expectedRole = route.data.expectedRole;
    const token = localStorage.getItem('token');
    // decode the token to get its payload
    const tokenPayload = this.token ? true : false;

    const roles = localStorage.getItem('roles');
    
    if (
      !this.auth.isAuthenticated() || 
      roles == 'Administrador'
    ) {
      this.router.navigate(['/admin/users/list']);
      return false;
    }
      return true;
    
  }
 
}
