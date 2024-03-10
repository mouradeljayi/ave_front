import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient,
              private UserService: UserService,
              private TranslateService: TranslateService) { }

  getDownloadStl(ref:string, type:string, isAverage:boolean){
    let headers = new HttpHeaders();

    let url = environment.api_url + 'api/'+ this.lang +'/stl/footid/' + ref + '/' + type + '.stl';
    if(isAverage){
      url = environment.api_url + 'api/'+ this.lang +'/stl/average/' + ref + '/' + type + '.stl';
    }

    headers = headers.set('Accept', 'application/STL');
    return this.http.get(url ,{ headers: headers, responseType: 'blob' });
  }
  getDownloadPdf(ref:string, type:string, data:any, isAverage:boolean){
    let headers = new HttpHeaders();
    let url = environment.api_url + 'api/'+ this.lang +'/pdf/footid/' + ref + '/' + type + '.pdf?';
    if(isAverage){
      url = environment.api_url + 'api/'+ this.lang +'/pdf/average/' + ref + '/' + type + '.pdf?';
    }
    headers = headers.set('Accept', 'application/pdf'); 
    return this.http.post( url + new Date().getTime().toString() , data ,{ headers: headers, responseType: 'blob' });
  }
  getDownloadExcel(type: string) {
    let url = environment.api_url + 'api/'+ this.lang +'/excel/' + type
    return this.http.get(url, { responseType: 'blob' });
  }
  downloadFile(data: any, name:string) {
    const blob = new Blob([data], { type: 'octet/stream' });
    let a = document.createElement('a');
    document.body.appendChild(a);
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);
  }
  getStlMesures(ref:string, type:string, isAverage:boolean){
    let url = environment.api_url + 'api/'+ this.lang +'/mesures/footid/' + ref + '/' + type;
    if(isAverage){
      url = environment.api_url + 'api/'+ this.lang +'/mesures/average/' + ref + '/' + type;
    }
    return this.http.get(url)
  }

  getLastMesures(ref:string){
    let url = this.UserService.user.linked_platform + '/footengineers/last/' + ref + '.mesure';
    return this.http.get(url)
  }

  get lang(){
    return this.TranslateService.getDefaultLang()
  }
}
