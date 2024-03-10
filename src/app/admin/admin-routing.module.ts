import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { canActivateAdmin } from '../guards/adminGuard';
import { AdminMainComponent } from './main/main.component';
import { AdminCompanyComponent } from './company/company.component';
import { CompanyUsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: '', canActivate: [ canActivateAdmin ], component: AdminMainComponent
  },
  {
    path: 'companies', canActivate: [ canActivateAdmin ], component: AdminCompanyComponent
  },
  {
    path: 'companies/:ref/users', canActivate: [ canActivateAdmin ], component: CompanyUsersComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplateRoutingModule { }
