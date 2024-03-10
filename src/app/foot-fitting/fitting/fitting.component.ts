import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocalService } from 'src/app/services/local.service';
@Component({
  selector: 'app-fitting',
  templateUrl: './fitting.component.html',
  styleUrls: ['./fitting.component.scss'],

})
export class FittingComponent implements OnInit {
  
  subscriptions: Subscription[] = [];
  isOverlay: boolean = false;

  constructor(private router: Router, private localService: LocalService) { }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
   
  ngOnInit(): void {
    if (this.localService.selected_foot_id) {
      this.router.navigate(['/foot-fitting/evaluation']);
    }

    this.subscriptions.push(this.localService.open_setting.subscribe((isOverlay)=>{
      this.isOverlay = isOverlay
    }))
    
  }

}
