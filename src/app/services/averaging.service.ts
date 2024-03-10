import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AveragingService {

  constructor(private http: HttpClient,  private userService: UserService, private TranslateService: TranslateService) { }

  createNewAverage(data:any){

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post(environment.api_url + 'api/'+ this.lang +'/average/new', data, { headers : headers });
  }
  // getFootIDsByPage(page: number = 0){
  //   const pageSize : any = localStorage.getItem('pageSize') ? localStorage.getItem('pageSize') : '15';

  //   return this.http.get(environment.api_url + 'api/'+ this.lang +'/footid/all',{
  //     params: new HttpParams().set('pageSize', pageSize).set('page', page)
  //   });
  // }

  deleteAverage(ref: any) {
    return this.http.delete(environment.api_url + 'api/' + this.lang + '/average/' + ref);
  }
  getOneAverage(ref: any) {
    return this.http.get(environment.api_url + 'api/' + this.lang + '/average/' + ref);
  }
  // formDataToJson(formData: FormData): any {
  //   const jsonObject: { [key: string]: any } = {};
  //   formData.forEach((value, key) => {
  //     jsonObject[key] = value;
  //   });
  //   return jsonObject;
  // }
  updateAverage(ref: any, data:any){
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.put(environment.api_url + 'api/'+ this.lang +'/average/edit/' + ref, data,{ headers : headers });
  }
  getSearchByPage(filter:any ,page: number = 0){
    const pageSize : any = this.userService.user.items_number

    return this.http.post(environment.api_url + 'api/'+ this.lang +'/average/search',filter, {
      params: new HttpParams().set('pageSize', pageSize).set('page', page)
    });
  }
  get lang(){
    return this.TranslateService.getDefaultLang()
  }
}
