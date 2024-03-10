import { ReactiveFormsModule } from "@angular/forms";
import { AveragingComponent } from "./averaging/averaging.component";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { FootInventoryModule } from "src/app/foot-inventory/foot-inventory.module";
import { NewAveragingComponent } from "./new/new-averaging.component";
import { AveragingListingComponent } from "./listing/listing.component";
import { ListingAvgComponent } from "./new/listing/listing.component";


@NgModule({
  declarations: [
    AveragingComponent,
    NewAveragingComponent,
    AveragingListingComponent,
    ListingAvgComponent
  ],
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    SharedModule,
    RouterModule,
    FootInventoryModule
  ],
  exports: [
    AveragingComponent,
    NewAveragingComponent,
    AveragingListingComponent,
    ListingAvgComponent
  ]
})
export class FootAveragingModule { }
