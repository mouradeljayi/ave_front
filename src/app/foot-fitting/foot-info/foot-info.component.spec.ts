import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FootInfoComponent } from './foot-info.component';

describe('FootInfoComponent', () => {
  let component: FootInfoComponent;
  let fixture: ComponentFixture<FootInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FootInfoComponent]
    });
    fixture = TestBed.createComponent(FootInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
