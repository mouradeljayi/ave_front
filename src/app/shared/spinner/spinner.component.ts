import { Component, OnDestroy, OnInit } from '@angular/core';
import { SpinnerService } from './spinner.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html'
})
export class SpinnerComponent implements OnInit, OnDestroy {
  isVisible: boolean = true;
  subscriptions: Subscription[] = []

  constructor(private SpinnerService: SpinnerService) { }
  ngOnInit(): void {
    this.subscriptions.push(this.SpinnerService.spinnerSubject.subscribe((data) => {
      if(data.spinner_number == 0){
        this.isVisible = data.status
      }
    }))
  }
  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe()
    }
  }
}
