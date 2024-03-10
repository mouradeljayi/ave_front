import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  isUserMenu: boolean = false;
  constructor(public UserService:UserService,
              public translate:TranslateService){
              }
  showUserMenu() {
    if (!this.isUserMenu) {
      this.isUserMenu = true
    }
  }
  hideUserMenu() {
    this.isUserMenu = false
  }
  switchLang(lang:string) {
    if(lang == 'en'){
      this.translate.use('fr');
      this.translate.setDefaultLang('fr')
      localStorage.setItem('lang','fr');
    }else{
      this.translate.use('en');
      this.translate.setDefaultLang('en')
      localStorage.setItem('lang','en');
    }
  }
}
