import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SceneService {

    show_stl:Subject<any> = new Subject<any>();
    show_second_stl:Subject<any> = new Subject<any>();
    download_stl:Subject<any> = new Subject<any>();
    download_second_stl:Subject<any> = new Subject<any>();
    foot_direction:Subject<string> = new Subject<string>();
    download_last_stl:Subject<any> = new Subject<any>();
    clear_scene:Subject<void> = new Subject<void>();
    resize:Subject<void> = new Subject<void>();
    capture:Subject<void> = new Subject<void>();
    transform:Subject<'translate' | 'rotate' | null> = new Subject<'translate' | 'rotate' | null>();

  constructor(
  ) { }
}