import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SceneService } from 'src/app/scene/main/scene.service';
import { FootService } from 'src/app/services/foot.service';
import { LastService } from 'src/app/services/last.service';
import { LocalService } from 'src/app/services/local.service';
import { StaticDataService } from 'src/app/services/static.service';
import { ToolboxService } from 'src/app/services/toolbox.service';
import { SpinnerService } from 'src/app/shared/spinner/spinner.service';

@Component({
  selector: 'app-selected',
  templateUrl: './selected.component.html',
  styleUrls: ['./selected.component.scss']
})
export class SelectedComponent implements OnInit, OnDestroy {

  direction: string = 'right';
  selected_foot: any = null
  selected_last: any = null
  isAverage: any = false
  subscriptions: Subscription[] = [];

  constructor(
    public lastService: LastService,
    public footService: FootService,
    private localService: LocalService,
    private spinnerService: SpinnerService,
    private sceneService: SceneService,
    private toolboxService: ToolboxService,
    private staticService: StaticDataService
  ) { }

  ngOnInit(): void {
    if (this.localService.selected_foot_id) {
      this.direction = this.localService.selected_foot_id.default_direction
      this.selected_foot = this.localService.selected_foot_id
    }
    this.subscriptions.push(this.localService.select_subject.subscribe((data) => {
      this.selected_foot = data
    }))

    if (this.localService.selected_last) {
      this.selected_last = this.localService.selected_last
    }
    this.subscriptions.push(this.localService.select_last_subject.subscribe((selected_last) => {
      this.selected_last = selected_last
    }))
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  isProcessed() {
    if (this.direction == 'left') {
      return this.selected_foot.left_status == 'processed'
    }
    return this.selected_foot.right_status == 'processed'
  }
  isError() {
    if (this.direction == 'left') {
      return this.selected_foot.left_status == 'error'
    }
    return this.selected_foot.right_status == 'error'
  }

  selectFootDirection(direction: string) {
    this.staticService.setInitialPosition()
    this.direction = direction
    this.getObjectToScene();
  }

  getObjectToScene() {
    if (this.isProcessed()) {
      this.toolboxService.open_toolbox.next(false)
      this.spinnerService.show(1);
      this.sceneService.download_stl.next({ ref: this.selected_foot.ref, direction: this.direction, isAverage: this.isAverage })
    } else {
      this.sceneService.clear_scene.next();
      this.spinnerService.hide(1);
    }
  }

  openLastInventory(): void {
    this.lastService.open_inventory.next(true);
  }

  onpenFootInventory(): void {
    this.footService.open_inventory.next(true);
  }

  clear(type : 'foot' | 'last'){

    if(type === 'foot') {
      this.localService.selectFootId(null)
      this.toolboxService.open_toolbox.next(false)
    }else if(type === 'last') {
      this.localService.selectLast(null)
      this.toolboxService.open_toolbox.next(false)
      this.localService.clear_last.next();
    }
  }

  
}
