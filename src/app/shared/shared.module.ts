import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner/spinner.component';
import { SearchableSelectComponent } from './searchable-select/searchable-select.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewComponent } from './new/new.component';
import { FieldComponent } from './ui/field/field.component';
import { SceneModule } from '../scene/scene.module';
import { HttpClientModule } from '@angular/common/http';
import { MessagesComponent } from './messages/messages.component';
import { FootViewComponent } from './foot-view/foot-view.component';
import { EmptyPipe } from '../pipes/empty/empty.pipe';
import { SpinnerHtmlComponent } from './spinner/spinner-html.component';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from '../pages/not-found/not-found.component';
import { LayoutsModule } from '../layouts/layouts.module';
import { HomeComponent } from '../pages/home/home.component';
import { LoginComponent } from '../pages/login/login.component';
import { LoginFormComponent } from '../pages/login/login-form/login-form.component';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { SearchComponent } from './search/search.component';
import { SearchFormComponent } from './search/search-form/form-search.component';
import { TranslateModule } from '@ngx-translate/core';
import { PopupComponent } from './ui/popup/popup.component';
import { SliderComponent } from './slider/slider.component';
import { TableCustomComponent } from './table-custom/table-custom.component';
import { FullScreenComponent } from './full-screen/full-screen.component';



@NgModule({
  declarations: [
    SpinnerComponent,
    SearchableSelectComponent,
    NewComponent,
    FieldComponent,
    MessagesComponent,
    FootViewComponent,
    EmptyPipe,
    SpinnerHtmlComponent,
    NotFoundComponent,
    HomeComponent,
    LoginComponent,
    LoginFormComponent,
    SearchComponent,
    SearchFormComponent,
    PopupComponent,
    SliderComponent,
    TableCustomComponent,
    FullScreenComponent
  ],
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    SceneModule,
    RouterModule,
    LayoutsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    TranslateModule
  ],
  exports: [
    SpinnerComponent,
    SearchableSelectComponent,
    NewComponent,
    FieldComponent,
    MessagesComponent,
    FootViewComponent,
    EmptyPipe,
    SpinnerHtmlComponent,
    SearchComponent,
    SearchFormComponent,
    PopupComponent,
    SliderComponent,
    TableCustomComponent,
    FullScreenComponent,
  ]
})
export class SharedModule { }
