import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LocalService } from 'src/app/services/local.service';
import { SpinnerService } from 'src/app/shared/spinner/spinner.service';
@Component({
  selector: 'app-new-averaging',
  templateUrl: './new-averaging.component.html',
  styleUrls: ['./new-averaging.component.scss']
})
export class NewAveragingComponent implements OnInit, OnDestroy {

  selected_foot: any = null;
  report_spinner: boolean = false;
  subscriptions: Subscription[] = [];
  constructor(private cd: ChangeDetectorRef,
    private SpinnerService: SpinnerService,
    private LocalService: LocalService) {

  }
  ngOnInit(): void {
    this.selected_foot = this.LocalService.selected_foot_id
    this.subscriptions.push(this.LocalService.select_subject.subscribe((selected_foot: any) => {
      this.selected_foot = selected_foot
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
}