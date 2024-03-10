import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StaticDataService } from 'src/app/services/static.service';
import { UserService } from 'src/app/services/user.service';
import { SpinnerService } from 'src/app/shared/spinner/spinner.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy{
  animate:boolean = false
  showlogin:boolean = false
  subscriptions: Subscription[] = [];

  constructor(private UserService:UserService,private SpinnerService:SpinnerService, private StaticDataService:StaticDataService, private router:Router){

  }

  ngOnInit(): void {

    this.SpinnerService.globalSpinnerSubject.next(true)
    this.subscriptions.push(this.UserService.isAuthenticated().subscribe({
      next : (response : any) => {
        this.UserService.user = response.user
        this.StaticDataService.setStaticData(response)
          this.router.navigateByUrl('/');
        },
        error : (err) => {
          Promise.resolve().then(()=>{
            this.SpinnerService.globalSpinnerSubject.next(false)
          })
      },
    }))
      setTimeout(()=>{
        this.animate = true
        setTimeout(()=>{
          this.showlogin = true
        }, 800)
      })
  }
  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}