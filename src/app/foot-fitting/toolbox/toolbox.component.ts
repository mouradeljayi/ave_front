import { Component, OnDestroy, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from "@angular/animations";
import { Subscription } from "rxjs";
import { ToolboxService } from "../../services/toolbox.service";
import * as THREE from 'three';
import { SceneService } from 'src/app/scene/main/scene.service';
import { StaticDataService } from 'src/app/services/static.service';
@Component({
  selector: 'app-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.scss'],
  animations: [
    trigger('toggleToolBox', [
      state('in', style({ transform: 'translateX(0)' })),
      transition(':enter', [style({ transform: 'translateX(-500px)' }), animate('300ms ease-in')]), transition(':leave', [animate('300ms ease', style({ transform: 'translateX(-500px)' }))])
    ]),
    trigger('toggleContent', [
      state('hidden', style({ height: '0', opacity: 0, display: 'none' })),
      state('visible', style({ height: '*', opacity: 1, display: 'block' })),
      transition('hidden => visible', animate('300ms ease-in')),
      transition('visible => hidden', animate('300ms ease-out')),
    ]),
    trigger('rotateIcon1', [
      state('normal', style({ transform: 'rotate(0deg)' })),
      state('rotated', style({ transform: 'rotate(90deg)' })),
      transition('normal <=> rotated', animate('300ms ease-in-out')),
    ]),
    trigger('rotateIcon2', [
      state('normal', style({ transform: 'rotate(0deg)' })),
      state('rotated', style({ transform: 'rotate(90deg)' })),
      transition('normal <=> rotated', animate('300ms ease-in-out')),
    ]),
    trigger('rotateIcon3', [
      state('normal', style({ transform: 'rotate(0deg)' })),
      state('rotated', style({ transform: 'rotate(90deg)' })),
      transition('normal <=> rotated', animate('300ms ease-in-out')),
    ]),
  ]
})
export class ToolboxComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = []
  animation_boolean: boolean = false;
  plane_display: boolean = true; // Initial state of the plane display
  isContentVisible1: boolean = false;
  isContentVisible2: boolean = false;
  isContentVisible3: boolean = false;
  selected_object: string = "foot"
  axis: { x: "X", y: "Y", z: "Z" } = { x: "X", y: "Y", z: "Z" }


  foot_position: THREE.Vector3 = new THREE.Vector3(0, 0, 0)
  last_position: THREE.Vector3 = new THREE.Vector3(0, 0, 0)

  foot_rotation: THREE.Vector3 = new THREE.Vector3(0, 0, 0)
  last_rotation: THREE.Vector3 = new THREE.Vector3(0, 0, 0)

  plane_position: THREE.Vector3 = new THREE.Vector3(0, 0, 0)
  plane_rotation: THREE.Vector3 = new THREE.Vector3(0, 0, 0)

  constructor(
    private toolboxService: ToolboxService,
    private sceneService: SceneService,
    private staticService: StaticDataService
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(this.toolboxService.open_toolbox.subscribe((isVisible) => {
      this.animation_boolean = isVisible
    }))
    this.subscriptions.push(
      this.toolboxService.plane_toggle.subscribe((display) => {
        this.plane_display = display;
      }));
    this.toolboxService.movePlane.subscribe((data) => {
      if (data.type === 'horizontal') {
        this.plane_rotation.set(90, data.y, data.z);
        this.plane_position.set(0,0,0)
      } else {
        this.plane_rotation.set(data.x, 90, data.z);
        this.plane_position.set(0,0,0)
      }
    });
    this.subscriptions.push(this.toolboxService.plane_position.subscribe((plane_position) => {
      this.plane_position.x = plane_position.x;
      this.plane_position.y = plane_position.y;
      this.plane_position.z = plane_position.z;
    }))
    this.subscriptions.push(this.toolboxService.plane_rotation.subscribe((plane_rotation) => {
      this.plane_rotation.x = plane_rotation.x;
      this.plane_rotation.y = plane_rotation.y;
      this.plane_rotation.z = plane_rotation.z;
    }))
    this.subscriptions.push(this.toolboxService.initial_pos.subscribe(() => {
      this.foot_position.x = this.foot_position.y = this.foot_position.z = this.foot_rotation.x = this.foot_rotation.y = this.foot_rotation.z =
        this.plane_position.x = this.plane_position.y = this.plane_position.z = this.plane_rotation.x = this.plane_rotation.y = this.plane_rotation.z = 0;
    }))
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe()
    }
  }

  close() {
    this.toolboxService.open_toolbox.next(false)
  }

  toggleContent(section: number) {
    if (section === 1) {
      this.isContentVisible1 = !this.isContentVisible1
    } else if (section === 2) {
      this.isContentVisible2 = !this.isContentVisible2
    } else if (section === 3) {
      this.isContentVisible3 = !this.isContentVisible3
    }
  }

  switchTo(form: string) {
    this.selected_object = form
  }

  translateObject(inputName: string, step: number) {
    const position = this.selected_object === 'foot' ? this.foot_position : this.last_position;

    if (this.selected_object == 'foot') {
      if (inputName === this.axis.x) {
        position.x += step;
      } else if (inputName === this.axis.y) {
        position.y += step;
      } else if (inputName === this.axis.z) {
        position.z += step;
      }
      this.toolboxService.translate.next({ axis: inputName, object: this.selected_object, distance: step });
    }
    if (this.selected_object == 'last') {
      if (inputName === this.axis.x) {
        position.x += step;
      } else if (inputName === this.axis.y) {
        position.y += step;
      } else if (inputName === this.axis.z) {
        position.z += step;
      }
      this.toolboxService.translate.next({ axis: inputName, object: this.selected_object, distance: step });
    }
  }

  rotateObject(inputName: string, step: number) {
    const position = this.selected_object === 'foot' ? this.foot_rotation : this.last_rotation;

    if (this.selected_object == 'foot') {
      if (inputName === this.axis.x) {
        position.x += step;
      } else if (inputName === this.axis.y) {
        position.y += step;
      } else if (inputName === this.axis.z) {
        position.z += step;
      }
      this.toolboxService.rotate.next({ axis: inputName, object: this.selected_object, angle: step });
    }
    if (this.selected_object == 'last') {
      if (inputName === this.axis.x) {
        position.x += step;
      } else if (inputName === this.axis.y) {
        position.y += step;
      } else if (inputName === this.axis.z) {
        position.z += step;
      }
      this.toolboxService.rotate.next({ axis: inputName, object: this.selected_object, angle: step });
    }
  }

  movePlane(inputName: string, step: number, type: any) {
    const target = type === "rotate" ? this.plane_rotation : this.plane_position;
    this.sceneService.transform.next(type)
    if (inputName === this.axis.x) {
      target.x += step;
      this.toolboxService.movePlane.next({
        type: type,
        x: step,
        y: 0,
        z: 0
      });
    } else if (inputName === this.axis.y) {
      target.y += step;
      this.toolboxService.movePlane.next({
        type: type,
        x: 0,
        y: step,
        z: 0
      });
    } else if (inputName === this.axis.z) {
      target.z += step;
      this.toolboxService.movePlane.next({
        type: type,
        x: 0,
        y: 0,
        z: step
      });
    }
  }

  initFoot() {
    this.staticService.setInitialPosition()
  }

  togglePlane() {
    this.plane_display = !this.plane_display;
    this.toolboxService.plane_toggle.next(this.plane_display);
  }

  horizontalPlane() {
    this.toolboxService.movePlane.next({
      type: "horizontal", x: Math.PI / 2, y: 0, z: 0
    });

  }

  verticalPlane() {
    this.toolboxService.movePlane.next({
      type: "vertical", x: 0, y: Math.PI / 2, z: 0
    });
  }


}
