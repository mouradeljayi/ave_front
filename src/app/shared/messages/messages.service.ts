import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MessagesService {
    get:Subject<{message:string, type:string}> = new Subject<{message:string, type:string}>;

    set(message:string, type:'normal' | 'error' | 'green' = "normal"){
      this.get.next({message:message, type:type});
    }
}