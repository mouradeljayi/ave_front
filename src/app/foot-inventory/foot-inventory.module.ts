import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ListingComponent } from './listing/listing.component';
import { SharedModule } from '../shared/shared.module';
import { InventoryComponent } from './inventory/inventory.component';
import { RouterModule } from '@angular/router';
import { MainSceneComponent } from '../scene/main/scene.component';

@NgModule({
  declarations: [
    ListingComponent,
    InventoryComponent,
  ],
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    SharedModule,
    RouterModule
  ],
  exports: [
    InventoryComponent,
    ListingComponent,
  ]
})
export class FootInventoryModule { }
