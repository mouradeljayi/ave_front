import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from '../pages/not-found/not-found.component';
import { FittingComponent } from "../foot-fitting/fitting/fitting.component";
import { ModificationComponent } from './modification/modification.component';
import { EvaluationComponent } from './evaluation/evaluation.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: FittingComponent,

  //   children: [
  //     {
  //       path: 'evaluation',
  //       component: EvaluationComponent,

  //     },
  //     {
  //       path: 'modification',
  //       component: ModificationComponent,
  //     },
  //   ]
  // },

  { path: '404-not-found', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FootFittingRoutingModule { }
