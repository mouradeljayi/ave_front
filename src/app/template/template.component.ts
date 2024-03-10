import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UIService } from '../services/ui.service';
import { Subscription } from 'rxjs';
import { LocalService } from '../services/local.service';
import { SearchService } from '../services/search.service';
import { SpinnerService } from '../shared/spinner/spinner.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit, OnDestroy {
  selected_foot: any = null;
  search: boolean = false;
  custom_table: boolean = false
  report_spinner: boolean = false;
  isAverage?: boolean = false;
  subscriptions: Subscription[] = [];
  constructor(private UIService: UIService,
    private SearchService: SearchService, 
    private cd: ChangeDetectorRef,
    private SpinnerService: SpinnerService,
    private LocalService: LocalService) {

  }
  ngOnInit(): void {
    this.selected_foot = this.LocalService.selected_foot_id
    this.subscriptions.push(this.LocalService.select_subject.subscribe((selected_foot) => {
      this.selected_foot = selected_foot
    }))
    this.subscriptions.push(this.LocalService.open_custom_table.subscribe((data) => {
      this.custom_table = data.open
      this.isAverage = data.isAverage
    }))
    this.subscriptions.push(this.SearchService.open_search.subscribe((search) => {
      if (!search) {
        setTimeout(() => {
          this.search = search
        }, 300)
      } else {
        this.search = search
      }
    }))
    this.subscriptions.push(this.SpinnerService.spinnerSubject.subscribe((data: any) => {
      if (data.spinner_number == 1) {
        this.report_spinner = data.status
        this.cd.detectChanges();
      }
    }))
  }
  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe()
    }
  }
  closeCustomTable() {
    this.LocalService.open_custom_table.next({open:false})
  }
  // close() {
  //   this.search = false;
  // }
}
