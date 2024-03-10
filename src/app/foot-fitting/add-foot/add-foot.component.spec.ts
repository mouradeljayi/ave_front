import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFootComponent } from './add-foot.component';

describe('AddFootComponent', () => {
  let component: AddFootComponent;
  let fixture: ComponentFixture<AddFootComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddFootComponent]
    });
    fixture = TestBed.createComponent(AddFootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
