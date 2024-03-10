import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { SceneService } from '../scene/main/scene.service';
import { ToolboxService } from './toolbox.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StaticDataService {

  countries: any[] = [];
  scanners: any[] = [];
  genders: any[] = [];
  categories: any[] = [];
  roles: any[] = [];
  system_sizes: any[] = [];
  system_size: string = 'eu';


  constructor(
    private http: HttpClient,
    private TranslateService: TranslateService, 
    private toolboxService: ToolboxService,
    private sceneService: SceneService) { }

  getStaticData(){
    return this.http.get(environment.api_url + 'api/'+ this.lang +'/static/data');
  }
  setStaticData(response:any){
    this.categories = [...response.data.categories]
    this.countries = [...response.data.countries]
    this.genders = [...response.data.genders]
    this.scanners = [...response.data.scanners]
    this.roles = [...response.data.roles]
    this.system_sizes = [...response.data.system_sizes]
    this.system_size = response.data.system_size
  }
  setInitialPosition() {
    this.toolboxService.translate.next({ axis: "R", object: "foot", distance: 0 });
    this.toolboxService.rotate.next({ axis: "R", object: "foot", angle: 0 });
    this.toolboxService.movePlane.next({ type: "reset", x: 0, y: 0, z: 0 })
    this.sceneService.transform.next(null)
    this.toolboxService.initial_pos.next();
  }
  
  get lang(){
    return this.TranslateService.getDefaultLang()
  }
}
