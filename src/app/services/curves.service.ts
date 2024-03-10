import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurvesService {
  toggleMesure: Subject<{ slug: string, type: string }> = new Subject<{ slug: string, type: string }>();
  curve_status: Subject<{ type:string, slug: string, status: boolean }> = new Subject<{ type:string, slug: string, status: boolean  }>();
  image: string | null =  null;
  constructor() { }

}
