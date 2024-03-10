import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-popup-ui',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent {
  @Output() cancel: EventEmitter<boolean> = new EventEmitter();
  hide(){
    this.cancel.emit(false)
  }
}
