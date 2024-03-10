import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLastComponent } from './add-last.component';

describe('AddLastComponent', () => {
  let component: AddLastComponent;
  let fixture: ComponentFixture<AddLastComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddLastComponent]
    });
    fixture = TestBed.createComponent(AddLastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
