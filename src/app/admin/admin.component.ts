import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UIService } from '../services/ui.service';
import { Subscription } from 'rxjs';
import { LocalService } from '../services/local.service';
import { SearchService } from '../services/search.service';
import { SpinnerService } from '../shared/spinner/spinner.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy{
  selected_foot:any = null;
  isFullWidth:boolean = false;
  search:boolean = false;
  report_spinner:boolean = false;
  subscriptions:Subscription[] = [];
  constructor(private SearchService:SearchService,
              private cd:ChangeDetectorRef,
              private SpinnerService:SpinnerService,
              private LocalService:LocalService){

  }
  ngOnInit(): void {
    this.selected_foot = this.LocalService.selected_foot_id
    this.subscriptions.push(this.LocalService.select_subject.subscribe((selected_foot)=>{
      this.selected_foot = selected_foot
    }))
    this.subscriptions.push(this.SearchService.open_search.subscribe((search)=>{
      this.search = search
    }))
    this.subscriptions.push(this.SpinnerService.spinnerSubject.subscribe((data:any) => {
        this.report_spinner = data.status
        this.cd.detectChanges();
    }))
  }
  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe()
    }
  }
  close() {
    this.search = false;
  }
}
