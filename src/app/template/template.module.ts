import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateComponent } from './template.component';
import { SharedModule } from '../shared/shared.module';
import { LayoutsModule } from '../layouts/layouts.module';
import { SceneModule } from '../scene/scene.module';
import { FootInventoryModule } from '../foot-inventory/foot-inventory.module';
import { TemplateRoutingModule } from './template-routing.module';
import { FootAveragingModule } from '../foot-averaging/foot-averaging.module';
import {FootFittingModule} from "../foot-fitting/foot-fitting.module";

@NgModule({
  declarations: [
    TemplateComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    LayoutsModule,
    SceneModule,
    FootInventoryModule,
    TemplateRoutingModule,
    FootAveragingModule,
    FootFittingModule,
  ],
  exports: [
    TemplateComponent
  ]
})
export class TemplateModule { }
