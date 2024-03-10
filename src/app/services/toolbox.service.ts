import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ToolboxService {

  open_toolbox:Subject<boolean> = new Subject<boolean>();
  initial_pos: Subject<void> = new Subject<void>();

  
  translate: Subject<{axis: string, object: string, distance: number}> 
  = new Subject<{axis: string, object: string, distance: number}>();


  rotate: Subject<{axis: string, object: string, angle: number}> 
  = new Subject<{axis: string, object: string, angle: number}>();

  movePlane: Subject<{type: string, x: number, y: number, z: number}> 
  = new Subject<{type: string, x: number, y: number, z: number}>();

  plane_position: Subject<THREE.Vector3> = new Subject<THREE.Vector3>()
  plane_rotation: Subject<any> = new Subject<any>()
  plane_toggle: Subject<boolean> = new Subject<boolean>()

  constructor() { }

}
