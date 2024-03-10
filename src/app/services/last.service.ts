import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LastService {

  open_inventory:Subject<boolean> = new Subject<boolean>();


  constructor(private http: HttpClient,
    private TranslateService: TranslateService,
    private UserService: UserService) { }

  getAllLasts(){
    // const pageSize : any = localStorage.getItem('pageSize') ? localStorage.getItem('pageSize') : '15';

    return this.http.get(environment.api_url + 'api/'+ this.lang +'/lastengineers/lasts');
  }

  // getLastStl(folder_ref:string, type : 'analyse' | 'optimize'){
  //   return this.http.get(this.UserService.user.linked_platform + '/footengineers/last/' + folder_ref + '.stl');
  // }

  get lang(){
    return this.TranslateService.getDefaultLang()
  }
}