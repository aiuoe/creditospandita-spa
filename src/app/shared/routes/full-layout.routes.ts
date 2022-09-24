import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth-guard.service';
import { RoleAdminGuard } from 'app/guards/role-admin.guard';
import {RoleGuardService as RoleGuard} from '../auth/role-guard.service';

// Route for content layout with sidebar, navbar and footer
export const Full_ROUTES: Routes = [
  // {
  //   path: 'changelog',
  //   loadChildren: './pages/changelog/changelog.module#ChangeLogModule'
  // },
  // {
  //   path: 'full-layout',
  //   loadChildren: './pages/full-layout-page/full-pages.module#FullPagesModule'
  // }
 
  {
    path: 'home',
    loadChildren:  './home/home.module#HomeModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: './admin/admin.module#AdminModule',


  },
  {
    path: 'contract',
    loadChildren: './contract/contract.module#ContractModule'
  },
  {
    path: 'credit',
    loadChildren: './credit/credit.module#CreditModule'
  },
  {
    path: 'admin-credit',
    loadChildren: './adminCredit/admin-credit.module#AdminCreditModule'
  },


];
