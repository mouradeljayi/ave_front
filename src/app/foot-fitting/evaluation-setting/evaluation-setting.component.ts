import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-evaluation-setting',
  templateUrl: './evaluation-setting.component.html',
  styleUrls: ['./evaluation-setting.component.scss'],
  animations: [
    trigger('toggleSetting', [
      state('in', style({ transform: 'translateY(0)' })),
      transition(':enter', [style({ transform: 'translateY(-100%)' }), animate('300ms ease-in')]),
      transition(':leave', [animate('300ms ease', style({ transform: 'translateY(-200%)' }))]),
    ]),
  ],
})
export class EvaluationSettingComponent implements OnInit, OnDestroy {


  subscriptions: Subscription[] = [];
  evaluation_setting_form: FormGroup;
  isVisible: boolean = false
  totalWeight: number

  evaluation_setting = [
    { name: "My Boot Setting", slug: "my_boot_setting" },
    { name: "Football Shoe Setting", slug: "football_shoe_setting" },
    { name: "High Heel Setting", slug: "high_heel_setting" },
    { name: "Sandal Setting", slug: "sandal_setting" }
  ]

  examples = [
    {
      footMetrics: [
        { name: "Lengths (mm)" },
        { name: "Foot Lengths (mm)", value: 243.63 },
        { name: "Widths (mm)" },
        { name: "Ball Width (mm)", value: 243.63 },
        { name: "Seat Length (mm)", value: 243.63 },
        { name: "Perimiters (mm)" },
        { name: "Insep Girth (mm)", value: 243.63 },
      ],
      lastMetrics: [
        { name: "Lengths (mm)" },
        { name: "Foot Lengths (mm)", value: 237.63 },
        { name: "Widths (mm)" },
        { name: "Ball Width (mm)", value: 237.63 },
        { name: "Seat Length (mm)", value: 237.63 },
        { name: "Perimiters (mm)" },
        { name: "Insep Girth (mm)", value: 237.63 },
      ],
      tolerances:
        [
          {

            "min": -3.00,
            "value1": -2.00,
            "value2": -1.00,
            "value3": 1.00,
            "value4": 2.00,
            "max": 3.00,
            "weight": 10,
            "enabled": false
          },
          {
            "min": -3.00,
            "value1": -2.00,
            "value2": -1.00,
            "value3": 1.00,
            "value4": 2.00,
            "max": 3.00,
            "weight": 10,
            "enabled": true,
          },
          {
            "min": -3.00,
            "value1": -2.00,
            "value2": -1.00,
            "value3": 1.00,
            "value4": 2.00,
            "max": 3.00,
            "weight": 10,
            "enabled": false
          },
          {
            "min": -3.00,
            "value1": -2.00,
            "value2": -1.00,
            "value3": 1.00,
            "value4": 2.00,
            "max": 3.00,
            "weight": 10,
            "enabled": true
          },
          {
            "min": -3.00,
            "value1": -2.00,
            "value2": -1.00,
            "value3": 1.00,
            "value4": 2.00,
            "max": 3.00,
            "weight": 10,
            "enabled": true
          },
          {
            "min": -3.00,
            "value1": -2.00,
            "value2": -1.00,
            "value3": 1.00,
            "value4": 2.00,
            "max": 3.00,
            "weight": 10,
            "enabled": false
          },
          {
            "min": -3.00,
            "value1": -2.00,
            "value2": -1.00,
            "value3": 1.00,
            "value4": 2.00,
            "max": 3.00,
            "weight": 10,
            "enabled": false
          },

        ],
    },
  ]



  constructor(private localService: LocalService, private cdRef: ChangeDetectorRef) { }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.calculateTotalWeight();
    this.init_form()
    this.subscriptions.push(this.localService.open_setting.subscribe((isVisible) => {
      this.isVisible = isVisible
    }))

  }

  calculateTotalWeight() {
    this.totalWeight = this.examples.reduce((sum, example) => {
      const exampleWeight = example.tolerances.reduce((toleranceSum, tolerance) => {
        if (tolerance.enabled) {
          return tolerance.weight !== 0 ? toleranceSum + tolerance.weight : toleranceSum;
        } else {
          return toleranceSum;
        }
      }, 0);
      return sum + exampleWeight;
    }, 0);
  }


  updateWeight(example: any, event: any) {
    const newWeight = parseFloat(event.target.value);
    const remainingWeight = 100 - (this.totalWeight - example.weight);
    if (newWeight <= remainingWeight) {
      example.weight = newWeight;
    } else {
      example.weight = remainingWeight;
    }
    this.calculateTotalWeight();
  }

  init_form() {
    this.evaluation_setting_form = new FormGroup({
      'selection': new FormControl('', []),
    });
  }

  select_evaluation_setting($event: any) {
    this.evaluation_setting_form.controls['selection'].setValue($event);
  }

  getDifference(footValue: number | undefined, lastValue: number | undefined): number | undefined {
    if (footValue !== undefined && lastValue !== undefined) {
      return footValue - lastValue;
    }
    return undefined;
  }

  toggleIcon(tolerance: any) {
    tolerance.enabled = !tolerance.enabled;
    this.calculateTotalWeight();
  }

  closeSetting() {
    this.localService.open_setting.next(false)
  }



}
