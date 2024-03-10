import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  public spinnerSubject: Subject<{status: boolean,spinner_number:number }> = new Subject<{status: boolean,spinner_number:number }>();
  public globalSpinnerSubject: Subject<boolean> = new Subject<boolean>();
  constructor() { }

  show(spinner_number:number = 0) {
    this.spinnerSubject.next({spinner_number: spinner_number, status:true})
  }
  
  hide(spinner_number:number = 0) {
    this.spinnerSubject.next({spinner_number: spinner_number, status:false})
  }
}
