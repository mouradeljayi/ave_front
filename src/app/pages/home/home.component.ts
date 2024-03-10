import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { SpinnerService } from 'src/app/shared/spinner/spinner.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  stats: any

  constructor(public UserService:UserService, private SpinnerService:SpinnerService){
    this.SpinnerService.globalSpinnerSubject.next(false)
  }
  ngOnInit(): void {
    this.UserService.getStats().subscribe({
      next:(response:any) => {
       this.stats = response
      },
      error: (err) => {
        console.log(err)
      }
    })
  }
}