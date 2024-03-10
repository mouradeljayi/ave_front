import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FootSceneComponent } from './foot-scene.component';

describe('FootSceneComponent', () => {
  let component: FootSceneComponent;
  let fixture: ComponentFixture<FootSceneComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FootSceneComponent]
    });
    fixture = TestBed.createComponent(FootSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
