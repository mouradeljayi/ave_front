import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SecondSceneComponent } from './second/scene.component';
import { MainSceneComponent } from './main/scene.component';

@NgModule({
  declarations: [
    SecondSceneComponent,
    MainSceneComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    SecondSceneComponent,
    MainSceneComponent
  ]
})
export class SceneModule { }
