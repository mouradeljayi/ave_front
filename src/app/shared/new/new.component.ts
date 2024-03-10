import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FootService } from 'src/app/services/foot.service';
import { SpinnerService } from '../spinner/spinner.service';
import { StaticDataService } from 'src/app/services/static.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as ENUMS from '../enums/generale'
import { SceneService } from 'src/app/scene/main/scene.service';
import { Subscription } from 'rxjs';
import { MessagesService } from '../messages/messages.service';
import { UIService } from 'src/app/services/ui.service';
import { LocalService } from 'src/app/services/local.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit, OnDestroy {

  @ViewChild('rightfoot') rightfoot!: ElementRef;
  @ViewChild('leftfoot') leftfoot!: ElementRef;

  dateNow: Date = new Date();

  subscriptions: Subscription[] = []
  right_foot_scene: boolean = false
  left_foot_scene: boolean = false
  left_foot: File | null = null;
  right_foot: File | null = null;
  title: "Create" | "Update" = "Create"
  selected_country: string
  selected_scanner: string
  ENUMS: any = ENUMS;
  add_new_form: FormGroup;
  foot_id = this.activatedRoute.snapshot.params['footId']
  selected_foot:any = null


  constructor(private FootService: FootService,
    private SpinnerService: SpinnerService,
    private SceneService: SceneService,
    private LocalService: LocalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private UIService: UIService,
    private MessagesService: MessagesService,
    public StaticDataService: StaticDataService
  ) { }

  ngOnInit(): void {
    this.SpinnerService.show();
    this.init_form();
    if(this.foot_id){
      this.editFoot();
    }
    this.subscriptions.push(this.StaticDataService.getStaticData().subscribe({
      next: (response: any) => {
        this.SpinnerService.hide();
        this.StaticDataService.categories = [...response.categories]
        this.StaticDataService.countries = [...response.countries]
        this.StaticDataService.genders = [...response.genders]
        this.StaticDataService.scanners = [...response.scanners]
      },
      error: (error) => {
        this.SpinnerService.hide();
      }
    }))
  }
  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe()
    }
  }

  select_contry($event: any) {
    this.add_new_form.controls['country_name'].setValue($event);
  }
  select_scanner($event: any) {
    this.add_new_form.controls['scanner_name'].setValue($event);
  }

  init_form() {
    this.add_new_form = new FormGroup({
      'reference': new FormControl('', []),
      'gender_name': new FormControl('unknown', []),
      'category_name': new FormControl('unknown', []),
      'weight_value': new FormControl('', [Validators.pattern('[0-9]+')]),
      'height_value': new FormControl('', [Validators.pattern('[0-9]+')]),
      'age': new FormControl('', [Validators.pattern('[0-9]+')]),
      'country_name': new FormControl('', []),
      'scanner_name': new FormControl('', []),
      'note': new FormControl('', [])
    });
  }
  onCreateNew() {
    if (this.foot_id) {
      this.onUpdate()
    } else {
      if (this.add_new_form.valid) {
        this.SpinnerService.show();
        const formData = new FormData();
        this.right_foot != null ? formData.append('right_foot', this.right_foot, this.right_foot.name) : null;
        this.left_foot != null ? formData.append('left_foot', this.left_foot, this.left_foot.name) : null;
        const data = this.add_new_form.value;
        Object.keys(data).forEach((key) => {
          if (data[key] != "" && data[key] != null) {
            formData.append(key, data[key]);
          }
        });

        this.FootService.createNewFoot(formData).subscribe({
          next: (response: any) => {
            this.SpinnerService.hide();
            this.MessagesService.set(response.message);
            this.LocalService.selected_foot_id = null
            this.router.navigateByUrl('/foot-inventory');
          },
          error: (err) => {
            this.SpinnerService.hide();
          }
        })
      } else {
        this.MessagesService.set('Fill All Fields')
      }
    }
  }

  uploadLeft() {
    if (!this.left_foot_scene) {
      this.leftfoot.nativeElement.click();
    }
  }
  uploadRight() {
    if (!this.right_foot_scene) {
      this.rightfoot.nativeElement.click();
    }
  }
  footChange(_$event: any, type: string) {
    let file = _$event.target.files[0]
    if (type == 'right') {
      this.right_foot_scene = true
      this.right_foot = file
      this.SceneService.show_second_stl.next({ name: 'right', file: file })
    } else if (type == 'left') {
      this.left_foot_scene = true
      this.left_foot = file
      this.SceneService.show_stl.next({ name: 'left', file: file })

    }
  }
  get countries() {
    return this.StaticDataService.countries
  }
  get scanners() {
    return this.StaticDataService.scanners
  }

  editFoot() {
      this.title = "Update"
      this.FootService.getOneFootID(this.foot_id).subscribe({
        next: (response: any) => {
          this.left_foot_scene = true
          this.SceneService.download_stl.next({ ref: response.foot.ref, direction: 'left', isAverage: false, isEdit: true })

          this.right_foot_scene = true
          this.SceneService.download_second_stl.next({ ref: response.foot.ref, direction: 'right', isAverage: false })

          const numericFields = ['height_value', 'weight_value'];
          const radioFields = ['gender_name', 'category_name'];
          const formValues: any = {};
          for (const field in this.add_new_form.controls) {
            if (response.foot.hasOwnProperty(field)) {
              let value = response.foot[field];
              if (field === "country_name") {
                this.selected_country = value
                this.select_contry(value)
              }
              if (field === "scanner_name") {
                this.selected_scanner = value
                this.select_scanner(value)
              }
              if (radioFields.includes(field)) {
                value = value.toLowerCase();
              }
              if (numericFields.includes(field)) {
                formValues[field] = parseInt(value);
              } else {
                formValues[field] = value;
              }
            }
          }
          this.add_new_form.patchValue(formValues);
          this.dateNow = response.foot.invented_at;
        }, error: (error:any) => {
          console.log(error)
        }
      })
  }

  onUpdate() {
    if (this.add_new_form.valid) {
      this.SpinnerService.show();
      const formData = new FormData();
      this.right_foot != null ? formData.append('right_foot', this.right_foot, this.right_foot.name) : null;
      this.left_foot != null ? formData.append('left_foot', this.left_foot, this.left_foot.name) : null;
      const data = this.add_new_form.value;
      
      Object.keys(data).forEach((key) => {
        if (data[key] != "" && data[key] != null) {
          formData.append(key, data[key]);
        }
      });
      this.FootService.updateFoot(this.foot_id, formData).subscribe({
        next: (response: any) => {
          this.SpinnerService.hide();
          this.MessagesService.set(response.message);
          this.LocalService.selected_foot_id = null
          this.router.navigateByUrl('/foot-inventory');
        },
        error: (err:any) => {
          this.SpinnerService.hide();
          console.log(err)
        }
      })
    } else {
      this.MessagesService.set('Fill All Fields')
    }
  }
}
