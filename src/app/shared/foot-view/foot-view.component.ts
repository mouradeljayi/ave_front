import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SceneService } from 'src/app/scene/main/scene.service';
import { FileService } from 'src/app/services/file.service';
import { SpinnerService } from '../spinner/spinner.service';
import { LocalService } from 'src/app/services/local.service';
import { MessagesService } from '../messages/messages.service';
import { CurvesService } from 'src/app/services/curves.service';
import { UIService } from 'src/app/services/ui.service';
import { Router } from '@angular/router';
// import { mesures } from '../enums/mesures';

@Component({
  selector: 'app-foot-view',
  templateUrl: './foot-view.component.html',
  styleUrls: ['./foot-view.component.scss']
})
export class FootViewComponent implements OnInit, OnDestroy, OnChanges {
  @Input() selected_foot: any = null
  @Input() isAverage: any = false
  zoom = 1
  direction: string = 'right';
  subscriptions: Subscription[] = []
  mesures: any[] = [];
  formated_keys: string[] = [];
  average_filter: any[] = [];
  is_full_screen:boolean = false

  constructor(private SceneService: SceneService,
    private StlService: FileService,
    public UIService: UIService,
    private router: Router,
    private CurvesService: CurvesService,
    private MessagesService: MessagesService,
    private LocalService: LocalService, 
    private SpinnerService: SpinnerService) { }

  ngOnChanges(changes: any): void {
    if (changes.selected_foot) {
      this.direction = this.selected_foot.default_direction
      this.getObjectToScene();
    }
  }

  ngOnInit(): void {
    this.subscriptions.push(this.LocalService.open_fullscreen.subscribe((isVisible) => {
      this.is_full_screen = isVisible
    }))
    this.subscriptions.push(this.SceneService.foot_direction.subscribe((direction) => {
      this.direction = direction
    }))
    this.subscriptions.push(this.LocalService.selected_foot_data_arrived.subscribe((data) => {
      this.mesures = data.mesures 
        this.mesures.forEach(mesure => {
          this.toggle(mesure.slug)
        });
    }))
    this.subscriptions.push(this.CurvesService.curve_status.subscribe((data) => {
      if (data.type == 'foot') {
        let index = this.mesures.findIndex((mesure) => mesure.slug == data.slug)
        if (index != -1) {
          this.mesures[index].show = data.status
        } 
      }
    }))
  }
  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe()
    }
  }
  toggle(slug: string) {
    this.CurvesService.toggleMesure.next({ slug: slug, type: 'foot' });
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
    this.SceneService.foot_direction.next(direction)
    this.getObjectToScene();
  }
  download() {
    this.SpinnerService.show(1);
    this.subscriptions.push(this.StlService.getDownloadStl(this.selected_foot.ref, this.direction, this.isAverage).subscribe({
      next: (data) => {
        const name = this.selected_foot.reference + '_' + this.direction + '.stl';
        this.StlService.downloadFile(data, name)
        this.MessagesService.set('Downloaded Successfully', 'green')
        this.SpinnerService.hide(1);
      },
      error: (err: any) => {
        this.SpinnerService.hide(1);
      },
    }))
  }
  downloadPDF() {
    this.SpinnerService.show(1);
    const data = { image: this.CurvesService.image }
    this.subscriptions.push(this.StlService.getDownloadPdf(this.selected_foot.ref, this.direction, data, this.isAverage).subscribe({
      next: (data) => {
        const name = this.selected_foot.reference + '_' + this.direction + '.pdf';
        this.StlService.downloadFile(data, name)
        this.MessagesService.set('PDF Downloaded Successfully', 'green')
        this.SpinnerService.hide(1);
      },
      error: (err: any) => {
        this.SpinnerService.hide(1);
      },
    }))
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
  getObjectToScene() {
    if (this.isProcessed()) {
      this.SpinnerService.show(1);
      this.SceneService.download_stl.next({ ref: this.selected_foot.ref, direction: this.direction, isAverage: this.isAverage })
    } else {
      this.SceneService.clear_scene.next();
      this.SpinnerService.hide(1);
    }

  }
  filterkeys() {
    if (this.selected_foot.filter instanceof Object) {
      const keys = Object.keys(this.selected_foot.filter)
      let keys_formated = [];
      const chunkSize = 2;
      for (let i = 0; i < keys.length; i += chunkSize) {
        const chunk = keys.slice(i, i + chunkSize);
        keys_formated.push(chunk)
      }
      return keys_formated;
    } else {
      return []
    }
  }
  getFilterValue(filter: any) {
    if (filter instanceof Object) {
      if (Array.isArray(filter) && filter.length == 1) {
        return filter[0];
      }
      return 'multiple';
    } else {
      return filter;
    }
  }

  editFoot() {
    const routePrefix = this.selected_foot.ref.startsWith('if') ? 'foot-inventory' : 'foot-averaging';
    this.router.navigate([`${routePrefix}/edit`, this.selected_foot.ref]);    
  }

  onFullScreen() {
    this.LocalService.open_fullscreen.next(true)
    
  }
  get showAll(){
    return this.mesures.findIndex((measure) => measure.show) != -1
  }
}
