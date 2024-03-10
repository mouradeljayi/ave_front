import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RecaptchaComponent } from 'ng-recaptcha';
import { UserService } from 'src/app/services/user.service';
import { MessagesService } from 'src/app/shared/messages/messages.service';
import { SpinnerService } from 'src/app/shared/spinner/spinner.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  animations: [
    trigger('loginState', [
      // state('in', style({
      //   transform: 'translateY(0)'
      // })),
      transition(':enter', [
        style({
          transform: 'translateY(-160%)'
        }),
        animate('300ms ease-in')
      ]),
      transition(':leave', [
        animate('300ms ease', style({
          transform: 'translateY(-160%)'
        }))
      ])
    ])
  ]
})
export class LoginFormComponent implements OnInit {
  siteKey: string = environment.recaptcha.siteKey
  loginForm: FormGroup;

  constructor(private UserService:UserService,
    private MessagesService:MessagesService,
    private router:Router,
    private SpinnerService:SpinnerService){

  }

  ngOnInit() {
    RecaptchaComponent.prototype.ngOnDestroy = function() {};
    this.loginForm = new FormGroup({
      footengineers_email: new FormControl(null, Validators.required),
      footengineers_password: new FormControl(null, Validators.required),
      recaptcha: new FormControl(null, Validators.required)
    });
    Promise.resolve().then(()=>{
      this.SpinnerService.hide()
    })
  }
  onLogin(){
    if(this.loginForm.valid){
      this.SpinnerService.show()
      let data = {
        username: this.loginForm.get('footengineers_email')?.value,
        password: this.loginForm.get('footengineers_password')?.value,
        recaptcha: this.loginForm.get('recaptcha')?.value,
      }
      this.loginForm.get('recaptcha')?.reset()
      this.UserService.login(data).subscribe({
        next : (response: any ) => {
          localStorage.setItem('token', response.token)
          this.router.navigateByUrl('/');
          this.SpinnerService.hide()
        },
        error : (err) => {
          this.SpinnerService.hide()
        },
      })
    }
  }
}