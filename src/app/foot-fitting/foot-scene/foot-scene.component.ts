import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToolboxService } from "../../services/toolbox.service";
import { Subscription } from "rxjs";
import { LocalService } from 'src/app/services/local.service';
import { SpinnerService } from 'src/app/shared/spinner/spinner.service';
import { SceneService } from 'src/app/scene/main/scene.service';
@Component({
  selector: 'app-foot-scene',
  templateUrl: './foot-scene.component.html',
  styleUrls: ['./foot-scene.component.scss']
})
export class FootSceneComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  selected: boolean = false
  selected_foot: any = null
  show_spinner: boolean = false
  isAverage: any = false
  direction: string = 'right';
  zoom = 2
  selected_object: string = "foot"
  position: "T" | "S"

  constructor(
    public toolboxService: ToolboxService,
    public localService: LocalService,
    private spinnerService: SpinnerService,
    private sceneService: SceneService
  ) { }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.subscriptions.push(this.spinnerService.spinnerSubject.subscribe((data: any) => {
      if (data.spinner_number == 1) {
        this.show_spinner = data.status;
      }
    }))
    if (this.localService.selected_foot_id) {
      if(this.localService.selected_foot_id.ref.includes('af')){
        this.isAverage = true
      }
      this.selected_foot = this.localService.selected_foot_id
      this.direction = this.localService.selected_foot_id.default_direction
      this.getObjectToScene();
    }
  }

  getObjectToScene() {
    if (this.isProcessed()) {
      this.spinnerService.show(1);
      this.sceneService.download_stl.next({
        ref: this.localService.selected_foot_id.ref,
        direction: this.direction, 
        isAverage: this.isAverage
      })
    } else {
      this.sceneService.clear_scene.next();
      this.spinnerService.hide(1);
    }
  }
  isProcessed() {
    if (this.direction == 'left') {
      return this.selected_foot.left_status == 'processed'
    }
    return this.selected_foot.right_status == 'processed'
  }

  rotate(position: any) {
    this.toolboxService.rotate.next({ axis: position, object: this.selected_object, angle: 0 });
  }

  openToolbox() {
    this.toolboxService.open_toolbox.next(true);
  }

  


}
