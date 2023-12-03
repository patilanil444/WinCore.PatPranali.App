import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GLInterestParameterComponent } from './gl-interest-parameter.component';

describe('GLInterestParameterComponent', () => {
  let component: GLInterestParameterComponent;
  let fixture: ComponentFixture<GLInterestParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GLInterestParameterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GLInterestParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
