import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LocalService } from 'src/app/services/local.service';
@Component({
  selector: 'app-foot-info',
  templateUrl: './foot-info.component.html',
  styleUrls: ['./foot-info.component.scss'],
  animations: [
    trigger('infoState', [
      state('in', style({
        transform: 'translateX(0)'
      })),
      transition(':enter', [
        style({
          transform: 'translateX(-500px)'
        }),
        animate('300ms ease-in')
      ]),
      transition(':leave', [
        animate('300ms ease', style({
          transform: 'translateX(-500px)'
        }))
      ])
    ])
  ]
})
export class FootInfoComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = []
  direction: string = 'right';
  selected_foot: any = null
  isAverage: any = false
  animation_boolean: boolean = false

  constructor(
    private localService: LocalService
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(this.localService.selected_foot_info.subscribe((selected_foot) => {
      this.selected_foot = selected_foot;
    }))
    this.subscriptions.push(this.localService.open_info.subscribe((isVisible) => {
      this.animation_boolean = isVisible
    }))

  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  close() {
    this.localService.open_info.next(false)
  }

}
