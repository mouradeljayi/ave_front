// admin/company/all

import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient, private TranslateService: TranslateService) { }

  getAllCompanies(){
    return this.http.get(environment.api_url + 'api/'+ this.lang +'/admin/company/all');
  }
  getCompanyUsers(ref:string){
    return this.http.get(environment.api_url + 'api/'+ this.lang +'/admin/company/'+ ref +'/users');
  }
  postNewCompany(data:any){
    return this.http.post(environment.api_url + 'api/'+ this.lang +'/admin/company/new', data);
  }
  updateCompany(ref: any, data:any){
    return this.http.put(environment.api_url + 'api/'+ this.lang +'/admin/company/' + ref, data);
  }
  postNewUser(data:any){
    return this.http.post(environment.api_url + 'api/'+ this.lang +'/admin/user/new', data);
  }
  updateUser(ref: any, data:any){
    return this.http.put(environment.api_url + 'api/'+ this.lang +'/admin/user/' + ref, data);
  }
  postLinkToLastengineers(data:any){
    return this.http.post(environment.api_url + 'api/'+ this.lang +'/admin/lastengineers/connect', data);
  }
  get lang(){
    return this.TranslateService.getDefaultLang()
  }
}
