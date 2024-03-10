import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CurvesService } from 'src/app/services/curves.service';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-modification',
  templateUrl: './modification.component.html',
  styleUrls: ['./modification.component.scss']
})
export class ModificationComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = []
  mesures: any[] = [];
  direction: string = 'right';
  selected_foot: any = null

  constructor(
    public localService: LocalService,
    private curvesService: CurvesService
  ) { }

  ngOnInit(): void {
    if (this.localService.selected_foot_id && this.localService.selected_foot_data) {
      this.direction = this.localService.selected_foot_id.default_direction
      this.mesures = this.localService.selected_foot_data.mesures
    }
    this.subscriptions.push(this.localService.selected_foot_data_arrived.subscribe((data) => {
      this.mesures = data.mesures
      console.log(this.mesures)
    }))
    // this.subscriptions.push(this.curvesService.curve_status.subscribe((data) => {
    //   if(data.type == 'foot'){
    //     let index = this.mesures.findIndex((mesure) => mesure.slug == data.slug)
    //     if (index != -1) {
    //       this.mesures[index].show = data.status
    //     }
    //   }
    // }))
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe()
    }
  }

  toggle(slug: string) {
    // this.curvesService.toggle.next({ slug: slug, type : 'foot'});
  }


}
