import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { SharedModule } from '../shared/shared.module';
import { LayoutsModule } from '../layouts/layouts.module';
import { SceneModule } from '../scene/scene.module';
import { FootInventoryModule } from '../foot-inventory/foot-inventory.module';
import { TemplateRoutingModule } from './admin-routing.module';
import { AdminMainComponent } from './main/main.component';
import { AdminCompanyComponent } from './company/company.component';
import { CompanyUsersComponent } from './users/users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AdminComponent,
    AdminMainComponent,
    AdminCompanyComponent,
    CompanyUsersComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutsModule,
    SceneModule,
    FootInventoryModule,
    TemplateRoutingModule
  ],
  exports: [
    AdminComponent
  ]
})
export class AdminModule { }
