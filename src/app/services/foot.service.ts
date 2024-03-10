import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class FootService {
  open_inventory:Subject<boolean> = new Subject<boolean>();
  constructor(private http: HttpClient,
              private userService: UserService,
              private TranslateService: TranslateService) { }

  createNewFoot(data:any){
    return this.http.post(environment.api_url + 'api/'+ this.lang +'/footid/new', data);
  }
  formDataToJson(formData: FormData): any {
    const jsonObject: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      jsonObject[key] = value;
    });
    return jsonObject;
  }
  updateFoot(ref: any, data:any){
    const jsonData = this.formDataToJson(data);
    return this.http.put(environment.api_url + 'api/'+ this.lang +'/footid/' + ref, jsonData);
  }
  getFootIDsByPage(page: number = 0){
    const pageSize : any = localStorage.getItem('pageSize') ? localStorage.getItem('pageSize') : '15';

    return this.http.get(environment.api_url + 'api/'+ this.lang +'/footid/all',{
      params: new HttpParams().set('pageSize', pageSize).set('page', page)
    });
  } 
  deleteFootID(ref: any) {
    return this.http.delete(environment.api_url + 'api/' + this.lang + '/footid/' + ref);
  }
  getOneFootID(ref: any) {
    return this.http.get(environment.api_url + 'api/' + this.lang + '/footid/' + ref);
  }
  getSearchByPage(filter:any ,page: number = 0){
    const pageSize : any = this.userService.user.items_number

    return this.http.post(environment.api_url + 'api/'+ this.lang +'/footid/search',filter, {
      params: new HttpParams().set('pageSize', pageSize).set('page', page)
    });
  }
  get lang(){
    return this.TranslateService.getDefaultLang()
  }
}
