import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SceneService } from 'src/app/scene/main/scene.service';
import { ToolboxService } from 'src/app/services/toolbox.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = []
  activated: 'rotate' | 'translate' | null = null;
  showPlane: boolean = true
  
  constructor(
    private sceneService: SceneService,
    public toolboxService: ToolboxService
  ) { }


  ngOnInit(): void {
    this.subscriptions.push(this.sceneService.transform.subscribe((type) => {
      this.activated = type
    }))
    this.subscriptions.push(this.toolboxService.plane_toggle.subscribe((isVisible) => {
      this.showPlane = isVisible
    }))
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe()
    }
  }

  transform(type: 'rotate' | 'translate') {
    if (!this.showPlane) {
      return;
    }

    if (this.activated === type) {
      this.activated = null;
      this.sceneService.transform.next(null);
    } else {
      this.activated = type;
      this.sceneService.transform.next(type);
    }

  }

}
