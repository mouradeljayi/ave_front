import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SpinnerService } from './shared/spinner/spinner.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  isLoading:boolean = false
  title = 'footengineers';
  subscriptions: Subscription[] = []
  
  constructor(private SpinnerService:SpinnerService,
              public translate: TranslateService){
                translate.addLangs(['en', 'fr']);
                let lang = localStorage.getItem('lang')
                if(lang && ['en', 'fr'].includes(lang)){
                  translate.setDefaultLang(lang);
                }else{
                  translate.setDefaultLang('en');
                  localStorage.setItem('lang','en');                  
                }

  }

  ngOnInit(): void {
    this.subscriptions.push(this.SpinnerService.globalSpinnerSubject.subscribe((data)=>{
      Promise.resolve().then(()=>{
        this.isLoading = data
      })
    }))
  }
  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe()
    }
  }


}
