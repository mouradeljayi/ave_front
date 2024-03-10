import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent {
  @Input() name:string = "name";
  @Input() required: boolean = false;
  @Input() help:string = "";
  @Input() width:string = "w-100";
  @Input() unit_width:string = "";
  // @Input() shadow:boolean = false;
  @Input() capitalize:boolean = true;
  

}
