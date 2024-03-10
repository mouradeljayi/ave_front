import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user:any = null
  constructor(private http: HttpClient,
              private router: Router,
              private TranslateService: TranslateService) { }

  login(data: { username: string, password: string, recaptcha: string }) {

    return this.http.post(environment.api_url + 'api/login', data);
  }
  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }

  isAuthenticated() {
    return this.http.get(environment.api_url + 'api/'+ this.lang +'/user/infos')
  }
  postSelectedColumns(columns: any) {
    return this.http.post(environment.api_url + 'api/'+ this.lang +'/user/columns',columns);
  }
  isAdmin() {
    return this.http.get(environment.api_url + 'api/'+ this.lang +'/user/isAdmin')
  }
  setPageSize(pagSize: any) {
    return this.http.post(environment.api_url + 'api/'+ this.lang +'/user/items', pagSize);
  }
  getStats() {
    return this.http.get(environment.api_url + 'api/'+ this.lang +'/user/stats')
  }
  get lang(){
    return this.TranslateService.getDefaultLang()
  }

}
