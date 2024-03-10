import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { SpinnerService } from 'src/app/shared/spinner/spinner.service';

@Component({
  selector: 'app-admin-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class AdminMainComponent {
  constructor(public UserService:UserService, private SpinnerService:SpinnerService){
    this.SpinnerService.globalSpinnerSubject.next(false)
  }

}