import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LocalService } from 'src/app/services/local.service';
import { SearchService } from 'src/app/services/search.service';
import { SpinnerService } from '../spinner/spinner.service';
import { MessagesService } from '../messages/messages.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-table-custom',
  templateUrl: './table-custom.component.html',
  styleUrls: ['./table-custom.component.scss'],
  animations: [
    trigger('tableState', [
      state('in', style({
        transform: 'translateX(0)'
      })),
      transition(':enter', [
        style({
          transform: 'translateX(500px)'
        }),
        animate('300ms ease-in')
      ]),
      transition(':leave', [
        animate('300ms ease', style({
          transform: 'translateX(500px)'
        }))
      ])
    ])
  ]
})
export class TableCustomComponent implements OnInit, OnDestroy {


  subscriptions: Subscription[] = []
  animation_boolean: boolean = false
  @Input() isAverage?: boolean = false
  selected_columns: 
  {
    inventory: { name: string, slug: string, status: boolean }[],
    average: { name: string, slug: string, status: boolean }[]
  } = 
  { inventory: [], average: [] };

  columns = { 
    inventory: 
    [
      { name: 'Preview', slug: 'image', status: false },
      { name: 'Foot ID', slug: 'foot_id', status: false },
      { name: 'Reference', slug: 'reference', status: false },
      { name: 'Gender', slug: 'gender_name', status: false },
      { name: 'Category', slug: 'category_name', status: false },
      { name: 'Country', slug: 'country_name', status: false },
      { name: 'L / R', slug: 'left_right', status: false },
      { name: 'Size', slug: 'size', status: false },
      { name: 'Weight', slug: 'weight_value', status: false },
      { name: 'Height', slug: 'height_value', status: false },
      { name: 'Age', slug: 'age', status: false },
      { name: 'Foot Type', slug: 'foot_type', status: false },
      { name: 'Arch Type', slug: 'arch_type', status: false },
      { name: 'Scanner', slug: 'scanner_name', status: false },
      { name: 'Added Date ', slug: 'invented_at', status: false },
  ],
  average: 
  [
    { name: 'Preview', slug: 'image', status: false },
    { name: 'Foot ID', slug: 'foot_id', status: false },
    { name: 'Reference', slug: 'reference', status: false },
    { name: 'Gender', slug: 'gender_name', status: false },
    { name: 'Category', slug: 'category_name', status: false },
    { name: 'Country', slug: 'country_name', status: false },
    { name: 'L / R', slug: 'left_right', status: false },
    { name: 'Size', slug: 'size', status: false },
    { name: 'Weight', slug: 'weight_value', status: false },
    { name: 'Height', slug: 'height_value', status: false },
    { name: 'Age', slug: 'age', status: false },
    { name: 'Foot Type', slug: 'foot_type', status: false },
    { name: 'Arch Type', slug: 'arch_type', status: false },
    { name: 'Scanner', slug: 'scanner_name', status: false },
    { name: 'Added Date ', slug: 'invented_at', status: false },
],
}

  constructor(
    private localService: LocalService,
    private UserService: UserService,
    private SearchService: SearchService,
    private messageService: MessagesService,
    private SpinnerService: SpinnerService
  ) { }

  ngOnInit(): void {
    this.columns.inventory.forEach((column) => {
      column.status = this.UserService.user.selected_columns['inventory'].some((el:any) => el.slug == column.slug);
    });
    
    this.columns.average.forEach((column) => {
      column.status = this.UserService.user.selected_columns['average'].some((el:any) => el.slug == column.slug);
    });
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
  sendSelectedColumns() {
    this.SpinnerService.show();
    this.UserService.postSelectedColumns( this.selected_columns ).subscribe({
      next: (response: any) => {
        this.UserService.user = response.user
        this.SearchService.search.next({ filter: this.SearchService.filters, page: 0 })
        this.localService.open_custom_table.next({open:false})
      },
      error: (error) => {
        this.SpinnerService.hide()
        console.log(error)
      }
    })
  }

  validateSelection() {
    this.selected_columns = {
      inventory: [],
      average: []
    };  
    this.columns.average.forEach((column) => {
      if (column.status) {
        const selectedColumn = { name: column.name, slug: column.slug, status: column.status };
        this.selected_columns['average'].push(selectedColumn);
      }
    });

    this.columns.inventory.forEach((column) => {
      if (column.status) {
        const selectedColumn = { name: column.name, slug: column.slug, status: column.status };
        this.selected_columns['inventory'].push(selectedColumn);
      }
    });

    if(this.selected_columns.average.length > 7 || this.selected_columns.inventory.length > 7) {
      this.messageService.set("You cannot choose more than 7 columns")
    }
  }
  
  close() {
    this.localService.open_custom_table.next({open:false})
  }


}
