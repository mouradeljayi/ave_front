import { Component, OnDestroy, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import { Subscription } from 'rxjs';
import { LastService } from 'src/app/services/last.service';
import { SpinnerService } from 'src/app/shared/spinner/spinner.service';
import { UserService } from 'src/app/services/user.service';
import { LocalService } from 'src/app/services/local.service';
import { SceneService } from 'src/app/scene/main/scene.service';

@Component({
  selector: 'app-add-last',
  templateUrl: './add-last.component.html',
  styleUrls: ['./add-last.component.scss'],
  animations: [
    trigger('toggleLastInventory', [
      state('in', style({transform: 'translateX(0)'})),
      transition(':enter', [style({transform: 'translateX(500px)'}), 
      animate('300ms ease-in')]),
      transition(':leave', 
      [animate('300ms ease', style({transform: 'translateX(800px)'}))])
    ]),
  ]
})
export class AddLastComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = []
  animation_boolean: boolean = false;
  type_last: string = 'analyse';
  lasts: any = [];

  constructor(private lastService:LastService,
              public UserService:UserService,
              public LocalService:LocalService,
              public SceneService:SceneService,
              private spinnerService: SpinnerService){
  }

  ngOnInit(): void {
    this.fetchLasts()
    this.subscriptions.push(this.lastService.open_inventory.subscribe((isVisible)=>{
      this.animation_boolean = isVisible
    }))
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe()
    }
  }

  fetchLasts() {
    // this.spinnerService.show()
    // this.subscriptions.push(this.lastService.getAllLasts().subscribe((response)=>{
    //   this.lasts = response
    //   this.spinnerService.hide()
    // }))
  }

  selectLast(last:any, type : 'analyse' | 'optimize' ){
    this.spinnerService.show()
    this.lastService.open_inventory.next(false)

    this.LocalService.selectLast(last);

    this.SceneService.download_last_stl.next({ ref: last.last_image })


    // this.subscriptions.push(this.lastService.getLastStl(last.last_image, type).subscribe((response)=>{
    //   // this.lasts = response
    //   console.log(response)
    //   this.spinnerService.hide()
    // }))
  }
  
  close(){
    this.lastService.open_inventory.next(false)
  }

}
