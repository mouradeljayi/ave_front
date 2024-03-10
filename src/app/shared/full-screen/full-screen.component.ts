import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SceneService } from 'src/app/scene/main/scene.service';
import { LocalService } from 'src/app/services/local.service';
import { SpinnerService } from '../spinner/spinner.service';
import { CurvesService } from 'src/app/services/curves.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.component.html',
  styleUrls: ['./full-screen.component.scss'],
  animations: [
    trigger('toggleContent', [
      state('hidden', style({ opacity: '0', height: '0', overflow:'hidden' })),
      state('visible', style({ opacity: '1', overflow:'visible'})),
      transition('hidden => visible', animate('300ms ease-in')),
      transition('visible => hidden', animate('300ms ease-out')),
    ]),
    trigger('rotateIcon', [
      state('normal', style({ transform: 'rotate(0deg)' })),
      state('rotated', style({ transform: 'rotate(90deg)' })),
      transition('normal <=> rotated', animate('300ms ease-in-out')),
    ]),
  ]
})
export class FullScreenComponent implements OnInit, OnDestroy, OnChanges {
  subscriptions: Subscription[] = [];
  @Input() selected_foot: any = null
  @Input() isAverage: any = false
  @Input() direction: string = 'right';
  @Input() showAll:boolean = false
  mesures: any[] = [];
  show_spinner: boolean = true
  isMetrics: boolean = false;

  constructor(
    private localService: LocalService,
    private sceneService: SceneService,
    private spinnerService: SpinnerService,
    private curvesService: CurvesService
  ) { }


  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
  ngOnChanges(changes: any): void {
      if (changes.selected_foot) {
        this.getObjectToScene();
      }
  }
  ngOnInit(): void {
    this.subscriptions.push(this.spinnerService.spinnerSubject.subscribe((data: any) => {
      if (data.spinner_number == 1) {
        this.show_spinner = data.status;
      }
    }))
    this.subscriptions.push(this.localService.selected_foot_data_arrived.subscribe((data) => {
      this.mesures = data.mesures
    }))
    this.subscriptions.push(this.curvesService.curve_status.subscribe((data) => {
      if (data.type == 'foot') {
        let index = this.mesures.findIndex((mesure) => mesure.slug == data.slug)
        if (index != -1) {
          this.mesures[index].show = data.status       
        }
      }
    }))

  }
  toggle(slug: string) {
    this.curvesService.toggleMesure.next({ slug: slug, type: 'foot' });
  }
  toggleAll() {
    const status = this.showAll
    this.mesures.forEach(mesure => {
      if(mesure.show == status){
        this.toggle(mesure.slug)
      }
    });
  }
  selectFootDirection(direction: string) {
    this.sceneService.foot_direction.next(direction)
    this.getObjectToScene();
  }
  getObjectToScene() {
    this.sceneService.foot_direction.subscribe((direction) => {
      this.direction = direction
    })
    if (this.isProcessed()) {
      this.spinnerService.show(1);
      this.sceneService.download_stl.next({ ref: this.selected_foot.ref, direction: this.direction, isAverage: this.isAverage })
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
  toggleContent() {
    this.isMetrics = !this.isMetrics
  }
  close() {
    this.localService.open_fullscreen.next(false)
    this.getObjectToScene()
  }

}
