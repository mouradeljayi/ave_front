import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FittingComponent } from './fitting/fitting.component';
import { ToolboxComponent } from './toolbox/toolbox.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {TranslateModule} from "@ngx-translate/core";
import { FootSceneComponent } from './foot-scene/foot-scene.component';
import { ListingComponent } from './listing/listing.component';
import { AddLastComponent } from './add-last/add-last.component';
import { AddFootComponent } from './add-foot/add-foot.component';
import { EvaluationComponent } from './evaluation/evaluation.component';
import { ModificationComponent } from './modification/modification.component';
import { MatchingComponent } from './matching/matching.component';
import { FootFittingRoutingModule } from './foot-fitting-routing.module';
import { SharedModule } from "../shared/shared.module";
import { ReactiveFormsModule } from '@angular/forms';
import { SceneModule } from '../scene/scene.module';
import { FootInfoComponent } from './foot-info/foot-info.component';
import { SelectedComponent } from './selected/selected.component';
import { EvaluationSettingComponent } from './evaluation-setting/evaluation-setting.component';



@NgModule({
    declarations: [
        FittingComponent,
        ToolboxComponent,
        TopBarComponent,
        FootSceneComponent,
        ListingComponent,
        AddLastComponent,
        AddFootComponent,
        EvaluationComponent,
        ModificationComponent,
        MatchingComponent,
        FootInfoComponent,
        SelectedComponent,
        EvaluationSettingComponent,
    ],
    imports: [
        CommonModule,
        RouterLinkActive,
        TranslateModule,
        RouterLink,
        FootFittingRoutingModule,
        SharedModule,
        SceneModule,
        ReactiveFormsModule
    ]
})
export class FootFittingModule { }
