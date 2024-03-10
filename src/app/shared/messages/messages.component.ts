import { Component, OnInit } from '@angular/core';
import { MessagesService } from './messages.service';
import { Subscription } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  animations: [
    trigger('opening', [
      state('in', style({
        transform: 'scale(0)'
      })),
      transition(':enter', [
        style({
          transform: 'scale(0)'
        }),
        animate('300ms ease-in')
      ]),
      transition(':leave', [
        animate('300ms ease', style({
          transform: 'scale(0)'
        }))
      ])
    ])

  ]
})
export class MessagesComponent implements OnInit {
  message: String = "Your Message Here" ;
  type:string = 'normal'
  show:boolean = false;
  animation_boolean: boolean = true;
  timeout_id: any = null;
  subscriptions:Subscription[] = [];


  constructor(private MessagesService:MessagesService) {

  }
  ngOnInit(): void {
    this.subscriptions.push(this.MessagesService.get.subscribe((data)=>{
      this.message = data.message
      this.type = data.type
      this.show = true
      this.animation_boolean = true
      this.timeout_id = setTimeout(()=>{
        this.hide()
      }, 3000)
    }))
  }
  hide(){
    this.animation_boolean = false
    clearTimeout(this.timeout_id);
    setTimeout(()=>{
      this.show = false
    },300)
  }
  messageType(){
    return this.type == 'error' ? 'Error' : 'Message'
  }
}
