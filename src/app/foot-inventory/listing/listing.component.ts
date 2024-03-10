import { ChangeDetectorRef, signal } from '@angular/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SceneService } from 'src/app/scene/main/scene.service';
import { FileService } from 'src/app/services/file.service';
import { FootService } from 'src/app/services/foot.service';
import { LocalService } from 'src/app/services/local.service';
import { SearchService } from 'src/app/services/search.service';
import { UIService } from 'src/app/services/ui.service';
import { UserService } from 'src/app/services/user.service';
import { MessagesService } from 'src/app/shared/messages/messages.service';
import { SpinnerService } from 'src/app/shared/spinner/spinner.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-inventory-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  options = [10, 15, 50, 100, 200]
  showOptions: boolean = false
  height: number = 100;
  selected_foot: any = null
  interval_id: any = null
  delete_ref: any
  all_refs: any[] = []
  columns : any[]= []
  selected_list: any[] = []
  tableCustom: boolean = false
  foots_list: any[] = []
  pagination_showing_list: any[] = []
  delete_popup: boolean = false
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

  filters = signal<any>([]);

  constructor(
    private FootService: FootService,
    public UserService: UserService,
    private UIService: UIService,
    private StlService: FileService,
    public SearchService: SearchService,
    private LocalService: LocalService,
    private SceneService: SceneService,
    private MessagesService: MessagesService,
    private SpinnerService: SpinnerService) {
  }
  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    clearInterval(this.interval_id);
    this.SearchService.filters = {}
    this.SearchService.isSearch = false
  }
  ngOnInit(): void {
    this.subscriptions.push(this.LocalService.select_subject.subscribe((selected_foot) => {
      this.selected_foot = selected_foot;
    }))
    this.subscriptions.push(this.UserService.isAuthenticated().subscribe((data:any) => {
      this.pagination.pageSize = data.user.items_number
    }))
    this.subscriptions.push(this.LocalService.open_custom_table.subscribe((data) => {
      this.tableCustom = data.open;
    }))
    this.subscriptions.push(this.SearchService.foot_list_changed.subscribe((listing) => {
      if(listing.pagination.current == 0){
        this.selected_list = [];
        this.all_refs = [...listing.all];
      }
      this.foots_list = listing.foots
      this.pagination = listing.pagination;
      let index = listing.foots.findIndex((footid:any)=>footid.status == 'processing')
      clearInterval(this.interval_id);
      if(index != -1){
        this.interval_id = setInterval(()=>{
          this.SearchService.search.next({ filter: this.SearchService.filters, page: this.pagination.current })
        },30000)
      }else{
        clearInterval(this.interval_id);
      }
      this.pagination_showing_list = [0, 1, this.pagination.current - 1, this.pagination.current, this.pagination.current + 1, this.pagination.count - 1, this.pagination.count]
      this.SpinnerService.hide()
      if (this.pagination.current == 0 && this.foots_list.length > 0) {
        this.SpinnerService.show(1);
        this.LocalService.selectFootId(this.foots_list[0])
      } else {
        this.SpinnerService.hide(1);
      }
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
  selectOption(option: number) {
    this.pagination.pageSize = option;
    this.sendOptions()
  }
  toggleOptions() {
    this.showOptions = !this.showOptions;
  }
  sendOptions() {
  this.SpinnerService.show()
    this.UserService.setPageSize(this.pagination.pageSize).subscribe({
      next: (data: any) => {
        this.UserService.user.items_number = data.pageSize
        this.FootService.getSearchByPage(this.SearchService.filters, 0).subscribe({
          next: (response: any) => {
            this.format_filters()
            this.SearchService.foot_list_changed.next(response)
            this.SpinnerService.hide()
            this.showOptions = false;
          }
        })
      },
      error: (error) => {
        this.SpinnerService.hide();
      }
    })
  }

  deleteConfirm(ref: any){
    this.delete_popup = true
    this.delete_ref = ref
  }
  cancel(){
    this.delete_popup = false
  }
  delete() {
    this.FootService.deleteFootID(this.delete_ref).subscribe({
      next: (response: any) => {
        this.cancel()
        this.MessagesService.set(response.message, 'green');
        this.foots_list = this.foots_list.filter(foot => foot.ref !== this.delete_ref);
        this.LocalService.select_subject.next(null)
      },
      error: (err) => {
        this.SpinnerService.hide();
      }
    })
    // this.SpinnerService.show(); 
    // this.StlService.getDownloadStl(ref, type).subscribe({
    //   next: (data) => {
    //     this.StlService.downloadFile(data,'test')
    //     this.SpinnerService.hide(); 
    //   },
    //   error: (err) => {
    //     console.log(err)
    //     this.SpinnerService.hide(); 
    //   },
    // })
  }

 
  downloadExcel() {
    this.SpinnerService.show();
    this.subscriptions.push(this.StlService.getDownloadExcel("foot").subscribe({
      next: (data) => {
        const name = 'FootEngineers_Foot_Inventory' + '.xlsx';
        this.StlService.downloadFile(data, name)
        this.MessagesService.set('Excel File Downloaded Successfully', 'green')
        this.SpinnerService.hide();
      },
      error: (err: any) => {
        this.SpinnerService.hide();
        console.log(err)
      },
    }))
  }

  toggleCustomTable() {
    this.LocalService.open_custom_table.next({open:!this.tableCustom, isAverage: false})
  }
  select(foot_id: any) {
    this.LocalService.selectFootId(foot_id);
    const index = this.selected_list.findIndex((el)=> el == foot_id.ref)
    if(index == -1){
      this.selected_list.push(foot_id.ref)
    }else{
      this.selected_list.splice(index,1)
    }
  }

  selectAll($event:any){
    if(this.selected_list.length == this.all_refs.length){
      this.selected_list = []
    }else{
      this.selected_list = [...this.all_refs]
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
