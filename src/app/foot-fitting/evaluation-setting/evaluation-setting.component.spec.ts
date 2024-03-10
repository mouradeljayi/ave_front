import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationSettingComponent } from './evaluation-setting.component';

describe('EvaluationSettingComponent', () => {
  let component: EvaluationSettingComponent;
  let fixture: ComponentFixture<EvaluationSettingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EvaluationSettingComponent]
    });
    fixture = TestBed.createComponent(EvaluationSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
