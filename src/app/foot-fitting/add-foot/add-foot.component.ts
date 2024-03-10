import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FootService } from 'src/app/services/foot.service';
import { SearchService } from 'src/app/services/search.service';
import { environment } from 'src/environments/environment';
import { SpinnerService } from 'src/app/shared/spinner/spinner.service';
import { AveragingService } from 'src/app/services/averaging.service';
import { FormControl, FormGroup } from '@angular/forms';
import { LocalService } from 'src/app/services/local.service';
import { SceneService } from 'src/app/scene/main/scene.service';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-add-foot',
  templateUrl: './add-foot.component.html',
  styleUrls: ['./add-foot.component.scss'],
  animations: [
    trigger('toggleFootInventory', [
      state('in', style({transform: 'translateX(0)'})),
      transition(':enter', [style({transform: 'translateX(500px)'}), 
      animate('300ms ease-in')]),
      transition(':leave', 
      [animate('300ms ease', style({transform: 'translateX(800px)'}))])
    ]),
  ]
})
export class AddFootComponent implements OnInit, OnDestroy {

  animation_boolean: boolean = false;
  subscriptions: Subscription[] = [];
  foot_type: "individual" | "average" = "individual"
  foots_list: any[] = []
  direction: string = 'right';
  isAverage: any = false
  search_form!: FormGroup;
  selected_foot: any = null
  initialValues!: any;
  pagination_showing_list: any[] = []
  pagination: {
    all: number,
    count: number,
    current: number,
    pageSize: number
  } = { all: 1, count: 1, current: 0, pageSize: 15};

  constructor(
    private router: Router,
    private footService: FootService,
    private averagingService: AveragingService,
    public searchService: SearchService,
    private localService: LocalService,
    private sceneService: SceneService,
    private spinnerService: SpinnerService
  ) { }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    this.searchService.filters = {}
    this.searchService.isSearch = false
  }

  ngOnInit(): void {
    this.subscriptions.push(this.footService.open_inventory.subscribe((isVisible)=>{
      this.animation_boolean = isVisible
      this.fetchData()
    }))
    this.initSearchForm()
    this.subscriptions.push(this.localService.select_subject.subscribe((selected_foot) => {
      this.selected_foot = selected_foot;
      this.router.navigate(['/foot-fitting/evaluation']);
    }))
    this.selected_foot = this.localService.selected_foot_id
  }

  fetchFoots() {
    this.spinnerService.show()
    this.subscriptions.push(this.searchService.foot_list_changed.subscribe((listing) => {
      this.foots_list = listing.foots
      this.pagination = listing.pagination;
      this.pagination_showing_list = [0, 1, this.pagination.current - 1, this.pagination.current, this.pagination.current + 1, this.pagination.count - 1, this.pagination.count]
      this.spinnerService.hide()
    }))

    this.subscriptions.push(
      this.searchService.search.subscribe((data) => {
        this.spinnerService.show()
        const selectedService = this.foot_type === "individual" ? this.footService : this.averagingService;
        this.subscriptions.push(
          selectedService.getSearchByPage(data.filter, data.page).subscribe({
            next: (response: any) => {
              this.searchService.foot_list_changed.next(response);
              this.spinnerService.hide()
            },
            error: (error) => {
              this.spinnerService.hide();
            },
          })
        );
      })
    );
  }

  fetchData(foot_type: "individual" | "average" = "individual") {
    this.foot_type = foot_type
    this.isAverage = foot_type === "average"
    this.fetchFoots();
    this.paginate(0);
  }

  initSearchForm() {
    this.search_form = new FormGroup({
      'reference': new FormControl('', []),
    });
    this.initialValues = this.search_form.value;
  }

  selectFoot(foot_id: any) {
    this.localService.selectFootId(foot_id);
    this.getObjectToScene()
    this.close()
  }

  getObjectToScene() {
    this.localService.selectFootId(this.selected_foot)
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


  onSubmit() {
    this.spinnerService.show();
    const data = this.search_form.value;
    this.searchService.filters = {};

    Object.keys(data).forEach((key) => {
      if (data[key] != "" && data[key] != null) {
        this.searchService.filters[key] = data[key]
      }
    });
    this.searchService.isSearch = true
    this.searchService.search.next({ filter: this.searchService.filters, page: 0 })
  }

  clearSearch() {
    this.spinnerService.show();
    this.search_form.reset(this.initialValues)
    this.searchService.filters = {}
    const data = this.search_form.value
    Object.keys(data).forEach((key) => {
      if (data[key] != "" && data[key] != null) {
        this.searchService.filters[key] = data[key]
      }
    });
    this.searchService.isSearch = false
    this.searchService.search.next({ filter: this.searchService.filters, page: 0 })
  }

  more(page: number) {
    return ((page == (this.pagination.current + 2)) || (page == (this.pagination.current - 2))) && page != 0 && (page != (this.pagination.count - 1));
  }

  get page_count() {
    return [...Array(this.pagination.count).keys()]
  }

  get first_el() {
    return (this.pagination.current * this.pagination.pageSize) + 1
  }
  get last_el() {
    const last = (this.pagination.current + 1) * this.pagination.pageSize
    return last > this.pagination.all ? this.pagination.all : last;
  }

  image(imageSrc: string) {
    return environment.api_url + imageSrc
  }

  paginate(page: number = 0) {
    this.spinnerService.hide();
    this.searchService.search.next({ filter: this.searchService.filters, page: page })
  }

  close(){
    this.footService.open_inventory.next(false)
  }


  openFootInfo(foot: any): void {
    this.localService.open_info.next(true)
    this.localService.selected_foot_info.next(foot)
  }


}
