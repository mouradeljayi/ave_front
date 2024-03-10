import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { StaticDataService } from 'src/app/services/static.service';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SearchService } from 'src/app/services/search.service';
import { MessagesService } from '../../messages/messages.service';
import { SpinnerService } from '../../spinner/spinner.service';
import { ActivatedRoute } from '@angular/router';
import { AveragingService } from 'src/app/services/averaging.service';

@Component({
  selector: 'app-form-search',
  templateUrl: './form-search.component.html',
  styleUrls: ['./form-search.component.scss'],
  animations: [
    trigger('toggleContent', [
      state('hidden', style({ opacity: '0', height: '0', overflow:'hidden' })),
      state('visible', style({ opacity: '1', overflow:'visible'})),
      transition('hidden => visible', animate('300ms ease-in')),
      transition('visible => hidden', animate('300ms ease-out')),
    ]),
    trigger('rotateIcon', [
      state('normal', style({ transform: 'rotate(0deg)' })),
      state('rotated', style({ transform: 'rotate(-90deg)' })),
      transition('normal <=> rotated', animate('300ms ease-in-out')),
    ]),

  ]

})
export class SearchFormComponent implements OnInit, OnDestroy {
  @Input() closable:boolean = true
  isVisible: boolean = false;
  isContent: boolean = false;
  subscriptions: Subscription[] = []
  search_form!: FormGroup;
  selected_country: string
  initialValues!: any;
  selected_countries = []
  selected_scanners = []
  avgId = this.activatedRoute.snapshot.params['avgId']


  constructor(private StaticDataService: StaticDataService,
    private AveragingService: AveragingService,
    private SearchService: SearchService,
    private activatedRoute: ActivatedRoute,
    private MessagesService: MessagesService,
    private SpinnerService: SpinnerService) {

  }
  ngOnInit(): void {
    this.isVisible = true;
    if(this.avgId) {
      this.editFoot()
    }
    this.subscriptions.push(this.StaticDataService.getStaticData().subscribe({
      next: (response: any) => {
        this.StaticDataService.categories = [...response.categories]
        this.StaticDataService.countries = [...response.countries]
        this.StaticDataService.genders = [...response.genders]
        this.StaticDataService.scanners = [...response.scanners]
        this.StaticDataService.system_size = response.system_size
        this.isVisible = false;
      },
      error: (error) => {
        this.isVisible = false;
      }
    }))
    this.initSearchForm()
    this.subscriptions.push(this.SearchService.search.subscribe((data: any) => {
      this.search_form.reset(this.SearchService.filters)
    }))
    
  }
  initSearchForm(){
    this.search_form = new FormGroup({
      'foot_id': new FormControl('', []),
      'reference': new FormControl('', []),
      'gender': new FormControl('', []),
      'category': new FormControl('', []),
      'system_size': new FormControl(this.system_size + '_size', []),
      'min_size': new FormControl('', [Validators.pattern('[0-9]+')]),
      'max_size': new FormControl('', [Validators.pattern('[0-9]+')]),
      'min_height': new FormControl('', [Validators.pattern('[0-9]+')]),
      'max_height': new FormControl('', [Validators.pattern('[0-9]+')]),
      'min_weight': new FormControl('', [Validators.pattern('[0-9]+')]),
      'max_weight': new FormControl('', [Validators.pattern('[0-9]+')]),
      'min_age': new FormControl('', [Validators.pattern('[0-9]+')]),
      'max_age': new FormControl('', [Validators.pattern('[0-9]+')]),
      'countries': new FormControl('', []),
      'scanners': new FormControl('', []),
      'foot_type': new FormControl('', []),
      'arch_type': new FormControl('', []),
      'direction': new FormControl('', []),
    });
    this.initialValues = this.search_form.value;
  }
  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe()
    }
  }
  editFoot() {
    this.AveragingService.getOneAverage(this.avgId).subscribe({
      next: (response: any) => {
        const radioFields = ['category', 'gender'];
        const specialFields = ['foot_type', 'arch_type'];
        const filters = [
          'system_size', 'gender',
          'max_age', 'min_age', 
          'min_size', 'max_size', 
          'max_weight', 'min_weight', 
          'max_height', 'min_height',
        ];

        for(const f in response.footAvg.filter) {
          if(filters.includes(f)) {
            const value = response.footAvg.filter[f];
            this.search_form.controls[f].setValue(value);
          }
        }
        const formValues: any = {};
        this.selected_country = response.footAvg.country
        this.select_contry(this.selected_country)
        for (const field in this.search_form.controls) {
          if (response.footAvg.hasOwnProperty(field)) {
            let value = response.footAvg[field];
            if (radioFields.includes(field)) {
              value = value.slug
            }
            if (specialFields.includes(field)) {
              value = value.split('/')[0].trim().toLowerCase()
            }
            formValues[field] = value;
          }
        }
        this.search_form.patchValue(formValues);
      }, error: (error: any) => {
        console.log(error)
      }
    })
  }
  closeSearch() {
    this.SearchService.open_search.next(false);
  }
  clearSearch() {
    this.SpinnerService.show();
    this.search_form.reset(this.initialValues)
    this.SearchService.filters = {}
    const data = this.search_form.value
    Object.keys(data).forEach((key) => {
      if (data[key] != "" && data[key] != null) {
        this.SearchService.filters[key] = data[key]
      }
    });
    this.SearchService.isSearch = false
    this.SearchService.search.next({ filter: this.SearchService.filters, page: 0 })
    this.selected_countries = []
    this.selected_scanners = []
  }
  select_contry($event: any) {
    this.search_form.controls['countries'].setValue($event);
  }
  select_scanner($event: any) {
    this.search_form.controls['scanners'].setValue($event);
  }
  onSubmit() {
    this.SpinnerService.show(); 
    const data = this.search_form.value;
    this.SearchService.filters = {};
    
    Object.keys(data).forEach((key) => {
      if (data[key] != "" && data[key] != null) {
        this.SearchService.filters[key] = data[key]
      }
    });
    this.SearchService.isSearch = true
    this.SearchService.search.next({filter: this.SearchService.filters, page: 0})
  }
  get countries() {
    return this.StaticDataService.countries
  }
  get scanners() {
    return this.StaticDataService.scanners
  }
  get system_size() {
    return this.StaticDataService.system_size
  }
  toggleContent(section: number) {
    if (section === 1) {
      this.isContent = !this.isContent
    }
  }
}