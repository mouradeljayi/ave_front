import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SceneService } from 'src/app/scene/main/scene.service';
import { LocalService } from 'src/app/services/local.service';
import { SpinnerService } from 'src/app/shared/spinner/spinner.service';
@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit, OnDestroy {

  width: string | null = localStorage.getItem('size') != null ? localStorage?.getItem('size') : '64';
  selected_foot: any = null;
  report_spinner: boolean = false;
  zoom = 3
  subscriptions: Subscription[] = [];
  constructor(private cd: ChangeDetectorRef,
    private SpinnerService: SpinnerService,
    private SceneService: SceneService,
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
  dropOver($e:DragEvent){
    const width = ($e.x/window.innerWidth)*100
    if(width > 70){
      this.width = '70';
    }else if(width < 40){
      this.width = '40';
    }else{
      this.width = width.toString();
    }
    localStorage.setItem('size',this.width.toString())
  }
  dropEnd($e:DragEvent){
      this.SceneService.resize.next()
  }
  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe()
    }
  }
}