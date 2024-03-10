import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewComponent } from '../shared/new/new.component';
import { InventoryComponent } from '../foot-inventory/inventory/inventory.component';
import { HomeComponent } from '../pages/home/home.component';
import { NotFoundComponent } from '../pages/not-found/not-found.component';
import { AveragingComponent } from '../foot-averaging/averaging/averaging.component';
import { NewAveragingComponent } from '../foot-averaging/new/new-averaging.component';
import { FittingComponent } from "../foot-fitting/fitting/fitting.component";
import { EvaluationComponent } from '../foot-fitting/evaluation/evaluation.component';
import { ModificationComponent } from '../foot-fitting/modification/modification.component';
import { ListingComponent } from '../foot-fitting/listing/listing.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'foot-inventory', children: [
      { path: '', component: InventoryComponent },
      { path: 'new', component: NewComponent },
      { path: 'edit/:footId', component: NewComponent }

    ]
  },
  {
    path: 'foot-averaging', children: [
      { path: '', component: AveragingComponent },
      { path: 'new', component: NewAveragingComponent },
      { path: 'edit/:avgId', component: NewAveragingComponent }
    ]
  },
  {
    path: 'foot-fitting', children: [
      {
        path: '', component: FittingComponent, children: [
          { path: '', component: ListingComponent },
          { path: 'evaluation', component: EvaluationComponent },
          { path: 'modification', component: ModificationComponent }
        ]
      },
    ]
  },
  { path: '404-not-found', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplateRoutingModule { }
