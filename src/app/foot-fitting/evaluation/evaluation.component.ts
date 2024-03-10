import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CurvesService } from 'src/app/services/curves.service';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss']
})
export class EvaluationComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = []
  mesures: any[] = [];
  last_mesures: any[] = [];
  selected_last:any = null
  direction:string = 'right';
  selected_foot:any = null
  evaluation_setting_form: FormGroup;
  evaluation_setting = [
    { name: "My Boot Setting", slug: "my_boot_setting" },
    { name: "Football Shoe Setting", slug: "football_shoe_setting" },
    { name: "High Heel Setting", slug: "high_heel_setting" },
    { name: "Sandal Setting", slug: "sandal_setting" }
  ]

  constructor(
    public localService: LocalService,
    private curvesService: CurvesService
  ) { }

  ngOnInit(): void {
    this.init_form()
    if(this.localService.selected_foot_id && this.localService.selected_foot_data){
      this.direction = this.localService.selected_foot_id.default_direction
      this.mesures = this.localService.selected_foot_data.mesures
    }
    this.subscriptions.push(this.localService.selected_foot_data_arrived.subscribe((data) => {
      this.mesures = data.mesures
    }))
    if(this.localService.selected_last && this.localService.selected_last_data){
      this.last_mesures = this.localService.selected_last_data
    }
    this.subscriptions.push(this.localService.selected_last_data_arrived.subscribe((data) => {
      this.last_mesures = data
      for (const subscription of this.subscriptions) {
        subscription.unsubscribe()
      }
      this.ngOnInit()
    }))
    this.subscriptions.push(this.curvesService.curve_status.subscribe((data) => {
      debugger
      if(data.type == 'foot'){
        let index = this.mesures.findIndex((mesure) => mesure.slug == data.slug)
        if (index != -1) {
          this.mesures[index].show = data.status
        }
      }
      if(data.type == 'last'){
        let index = this.last_mesures.findIndex((mesure) => mesure.slug == data.slug)
        if (index != -1) {
          this.last_mesures[index].show = data.status
        }
      }
    }))
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe()
    }
    // this.localService.selectLast(null)
    // this.localService.selected_last_data(null);
    // this.localService.selectFootId(null)
    // this.localService.selected_foot_data(null);
  }

  isProcessed(){
    if(this.direction == 'left'){
      return this.selected_foot.left_status == 'processed'
    }
    return this.selected_foot.right_status == 'processed'
  }

  toggle(slug: string, type:string = 'foot') {
    this.curvesService.toggleMesure.next({ slug: slug, type :type });
  }

  init_form() {
    this.evaluation_setting_form = new FormGroup({
      'selection': new FormControl('', []),
    });
  }
  select_evaluation_setting($event: any) {
    this.evaluation_setting_form.controls['selection'].setValue($event);
  }
  openSetting() {
    this.localService.open_setting.next(true)
  }
}
