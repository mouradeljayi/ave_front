import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalService {
  open_setting: Subject<boolean> =  new Subject<boolean>();
  open_fullscreen: Subject<boolean> =  new Subject<boolean>();
  open_info:Subject<boolean> = new Subject<boolean>();
  open_custom_table:Subject<{open: boolean, isAverage?: boolean}> = 
  new Subject<{open: boolean, isAverage?: boolean}>();
  
  selected_foot_id: any = null;
  selected_last: any = null;
  select_subject: Subject<any> = new Subject<any>();
  clear_last: Subject<void> = new Subject<void>();
  select_last_subject: Subject<any> = new Subject<any>();
  selected_foot_info: Subject<any> = new Subject<any>();
  selected_foot_data: any = null;
  selected_last_data: any = null;
  selected_foot_data_arrived: Subject<any> = new Subject<any>();
  selected_last_data_arrived: Subject<any> = new Subject<any>();
  constructor() { }
  selectFootId(select_foot_id: any) {
    this.selected_foot_id = select_foot_id
    this.select_subject.next(this.selected_foot_id);
  }
  selectLast(selected_last: any) {
    this.selected_last = selected_last
    this.select_last_subject.next(this.selected_last);
  }
  addData(select_foot_data: any) {
    this.selected_foot_data = select_foot_data
    this.selected_foot_data_arrived.next(this.selected_foot_data);
  }
  addLastData(select_last_data: any) {
    this.selected_last_data = select_last_data
    this.selected_last_data_arrived.next(this.selected_foot_data);
  }

}