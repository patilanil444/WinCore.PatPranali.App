import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandingInstructionsFormComponent } from './standing-instructions-form.component';

describe('StandingInstructionsFormComponent', () => {
  let component: StandingInstructionsFormComponent;
  let fixture: ComponentFixture<StandingInstructionsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandingInstructionsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandingInstructionsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
