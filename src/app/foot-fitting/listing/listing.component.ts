import { Component, EventEmitter, Output } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent {

  @Output() openAddFoot  = new EventEmitter<void>();

  image(imageSrc: string) {
    return environment.api_url + imageSrc
  }


}
