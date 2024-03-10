import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MessagesService } from '../shared/messages/messages.service';
import { SpinnerService } from '../shared/spinner/spinner.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  open_search:Subject<boolean> = new Subject<boolean>();
  foot_list_changed:Subject<any> = new Subject<any>();
  search:Subject<{filter:any, page:number}> = new Subject<{filter:any, page:number}>();
  isSearch:boolean = false;
  filters:any = {}
  foots_list: any[] = []
  constructor() { }

}
