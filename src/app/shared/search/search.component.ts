import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  animations: [
    trigger('searchState', [
      state('in', style({
        transform: 'translateX(0)'
      })),
      transition(':enter', [
        style({
          transform: 'translateX(500px)'
        }),
        animate('300ms ease-in')
      ]),
      transition(':leave', [
        animate('300ms ease', style({
          transform: 'translateX(500px)'
        }))
      ])
    ])

  ]})
export class SearchComponent implements OnInit, OnDestroy{
  // isVisible: boolean = true;
  subscriptions: Subscription[] = []
  animation_boolean: boolean = true;
  constructor(private SearchService:SearchService){
  }
  ngOnInit(): void {
    this.subscriptions.push(this.SearchService.open_search.subscribe((isVisible)=>{
      this.animation_boolean = isVisible
    }))
  }
  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe()
    }
  }
  close(){
    this.SearchService.open_search.next(false)
  }
}