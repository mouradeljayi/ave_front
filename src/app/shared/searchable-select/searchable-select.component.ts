import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-searchable-select',
  templateUrl: './searchable-select.component.html',
  styleUrls: ['./searchable-select.component.scss']
})
export class SearchableSelectComponent implements OnInit, OnChanges {

  @Output() select_event: EventEmitter<any> = new EventEmitter();
  @Input() name: string = 'name';
  @Input() placeholder: string;
  @Input() isMultiple: boolean = false;
  @Input() slug: string = 'slug';
  @Input() display_name: string = 'name';
  @Input() required: boolean = false;
  @Input() help: string = "";
  @Input() list: any[] = []
  @Input() selected_list: any = [];
  showing_list: any[] = [];
  @Input() selected_item: any = {};
  visible: boolean = false;

  ngOnInit(): void {
    this.showing_list = [...this.list]
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.showing_list = [...this.list]
  }
  onKey(event: any) {
    this.showing_list = this.list.filter((el) => el[this.display_name].toLowerCase().includes(event.target.value.toLowerCase()));
  }
  select(item: any) {
    this.selected_item = { ...item }
    if (!this.isMultiple) {
      this.selected_list = []
    } else {
      let index = this.selected_list.findIndex((el: any) => el[this.slug] == item[this.slug])
      if (index == -1) {
        this.selected_list.push({ ...item });
      } else {
        this.selected_list.splice(index, 1);
        this.selected_item = {}
      }
    }
    this.visible = false;
    if (this.isMultiple) {
      this.select_event.emit(this.selected_list.map((el: any) => el[this.slug]));
    } else {
      this.select_event.emit(this.selected_item[this.slug]);
    }
  }
  toggle() {
    this.visible = !this.visible
    this.showing_list = [...this.list]
  }
  open() {
    if (!this.visible) {
      this.visible = true
      this.showing_list = [...this.list]
    }
  }

  isActive(item: any) {
    if(this.isMultiple){
      return this.selected_list.some((el: any) => el[this.slug] == item[this.slug]);
    }else{
      return this.selected_item[this.slug] == item[this.slug]
    }
  }

}
