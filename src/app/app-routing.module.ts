import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateComponent } from './template/template.component';
import { LoginComponent } from './pages/login/login.component';
import { canActivateAuth } from './guards/authGuard';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  {
    path: '', canActivate: [ canActivateAuth ], component: TemplateComponent,
    loadChildren: () => import('./template/template.module').then(m => m.TemplateModule),
  },
  {
    path: 'admin', component: AdminComponent,
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/404-not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
