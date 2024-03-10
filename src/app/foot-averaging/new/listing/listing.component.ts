import { ChangeDetectorRef, signal } from '@angular/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AveragingService } from 'src/app/services/averaging.service';
import { FootService } from 'src/app/services/foot.service';
import { LocalService } from 'src/app/services/local.service';
import { SearchService } from 'src/app/services/search.service';
import { MessagesService } from 'src/app/shared/messages/messages.service';
import { SpinnerService } from 'src/app/shared/spinner/spinner.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-avg-inventory-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingAvgComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  height: number = 100;
  selected_foot: any = null
  foots_list: any[] = []
  selected_foot_list: any[] = []
  selected_list: any[] = []
  all_refs: any[] = []
  pagination_showing_list: any[] = []
  pagination: {
    all: number,
    count: number,
    current: number,
    pageSize: number
  } = {
      all: 1,
      count: 1,
      current: 0,
      pageSize: 15
    };
  title: "Creation" | "Update" = "Creation"
  filters = signal<any>([]);
  avgId = this.activatedRoute.snapshot.params['avgId']

  constructor(
    private FootService: FootService,
    private activatedRoute: ActivatedRoute,
    private AveragingService: AveragingService,
    private router: Router,
    public SearchService: SearchService,
    private MessagesService: MessagesService,
    private SpinnerService: SpinnerService) {
  }
  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    this.SearchService.filters = {}
    this.SearchService.isSearch = false
  }
  ngOnInit(): void {
    if(this.avgId){
      this.title = "Update"
      this.editFoot();
    }
    this.subscriptions.push(this.SearchService.foot_list_changed.subscribe((listing) => {
      if(listing.pagination.current == 0){
        this.selected_list = [];
        this.all_refs = [...listing.all];
      }
      this.foots_list = listing.foots
      this.pagination = listing.pagination;
      this.pagination_showing_list = [0, 1, this.pagination.current - 1, this.pagination.current, this.pagination.current + 1, this.pagination.count - 1, this.pagination.count]
      this.SpinnerService.hide()
      this.SpinnerService.hide(1);
    }))

    this.subscriptions.push(this.SearchService.search.subscribe((data) => {
      this.subscriptions.push((this.FootService.getSearchByPage(data.filter, data.page).subscribe({
        next: (response: any) => {
          this.format_filters()
          this.SearchService.foot_list_changed.next(response)
        },
        error: (error) => {
          this.SpinnerService.hide();
        },
      })))
    }))
    this.paginate(0);
  }

  select(foot_id: any) {
    const usedList: any = this.avgId ? this.selected_foot_list : this.selected_list
    const index = usedList.findIndex((el:any)=> el == foot_id.ref)
    if(index == -1){
      usedList.push(foot_id.ref)
    }else{
      usedList.splice(index,1)
    }
  }
  paginate(page: number = 0) {
    this.SpinnerService.show();
    this.SearchService.search.next({ filter: this.SearchService.filters, page: page })
  }

  search() {
    this.SearchService.open_search.next(true);
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
  more(page: number) {
    return ((page == (this.pagination.current + 2)) || (page == (this.pagination.current - 2))) && page != 0 && (page != (this.pagination.count - 1));
  }
  image(imageSrc: string) {
    return environment.api_url + imageSrc
  }
  clear(filter: string) {
    if (filter == 'all') {
      this.SpinnerService.show();
      this.SearchService.filters = {}
      this.SearchService.isSearch = false
      this.SearchService.search.next({ filter: this.SearchService.filters, page: 0 })
    } else {
      this.SpinnerService.show();
      Object.keys(this.SearchService.filters).filter((el)=>el.includes(filter)).forEach((fl)=>{
        delete this.SearchService.filters[fl]
      })
      this.SearchService.search.next({ filter: this.SearchService.filters, page: 0 })
    }
  }
  createFootAverage(){
    if(this.avgId) {
      this.updateFootAverage()
    } else {
      this.SpinnerService.show();
      const data = {foots:this.selected_list, filters:this.SearchService.filters}
      this.subscriptions.push(this.AveragingService.createNewAverage(data).subscribe({
        next : (response:any) => {
          this.SpinnerService.hide();
          this.MessagesService.set(response.message, 'green')
          this.router.navigateByUrl('/foot-averaging')
        },
        error : (error) => {
          this.SpinnerService.hide();
        },
      }))    
    }
  }
  editFoot() {
    this.AveragingService.getOneAverage(this.avgId).subscribe({
      next: (response: any) => {
        response.footIds.forEach((item:any) => {
          this.selected_foot_list.push(item.ref)
        });       
      }, error: (error: any) => {
        console.log(error)
      }
    })
  }
  updateFootAverage() {
    this.SpinnerService.show();
      const data = {foots:this.selected_foot_list, filters:this.SearchService.filters}
      this.subscriptions.push(this.AveragingService.updateAverage(this.avgId, data).subscribe({
        next : (response:any) => {
          this.SpinnerService.hide();
          this.MessagesService.set(response.message, 'green')
          this.router.navigateByUrl('/foot-averaging')
        },
        error : (error) => {
          this.SpinnerService.hide();
          console.log(error)
        },
      }))    
  }
  selectAll($event: any) {
    const targetList = this.avgId ? this.selected_foot_list : this.selected_list;
    if (targetList.length === this.all_refs.length) {
      targetList.length = 0;
    } else {
      targetList.splice(0, targetList.length, ...this.all_refs);
    }
  }
  
  format_filters() {
    let formated_filters:any = {}

    let filters = this.SearchService.filters
    if(filters.min_size != undefined || filters.max_size != undefined){
      formated_filters.size = filters.system_size.slice(0,2).toUpperCase();
      if(filters.min_size != undefined){
        formated_filters.size = filters.min_size + ' < ' + formated_filters.size
      }
      if(filters.max_size != undefined){
        formated_filters.size = formated_filters.size + ' < ' +  filters.max_size
      }
    }
    if(filters.min_age != undefined || filters.max_age != undefined){
      formated_filters.age = 'Age';
      if(filters.min_age != undefined){
        formated_filters.age = filters.min_age + ' < ' + formated_filters.age
      }
      if(filters.max_age != undefined){
        formated_filters.age = formated_filters.age + ' < ' +  filters.max_age
      }
    }

    if(filters.min_height != undefined || filters.max_height != undefined){
      formated_filters.height = 'Height';
      if(filters.min_height != undefined){
        formated_filters.height = filters.min_height + ' < ' + formated_filters.height
      }
      if(filters.max_height != undefined){
        formated_filters.height = formated_filters.height + ' < ' +  filters.max_height
      }
    }

    if(filters.min_weight != undefined || filters.max_weight != undefined){
      formated_filters.weight = 'Weight';
      if(filters.min_weight != undefined){
        formated_filters.weight = filters.min_weight + ' < ' + formated_filters.weight
      }
      if(filters.max_weight != undefined){
        formated_filters.weight = formated_filters.weight + ' < ' +  filters.max_weight
      }
    }

    if(filters.footid != undefined){
      formated_filters.footid = filters.footid;
    }
    if(filters.reference != undefined){
      formated_filters.reference = filters.reference;
    }
    if(filters.gender != undefined){
      formated_filters.gender = filters.gender;
    }
    if(filters.category != undefined){
      formated_filters.category = filters.category;
    }
    if(filters.country != undefined){
      formated_filters.country = filters.country;
    }
    if(filters.foottype != undefined){
      formated_filters.foottype = filters.foottype;
    }
    if(filters.archtype != undefined){
      formated_filters.archtype = filters.archtype;
    }
    this.filters.set(Object.entries( formated_filters ) );
  }
}
