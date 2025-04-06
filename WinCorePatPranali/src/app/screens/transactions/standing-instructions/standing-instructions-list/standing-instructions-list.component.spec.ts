import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandingInstructionsListComponent } from './standing-instructions-list.component';

describe('StandingInstructionsListComponent', () => {
  let component: StandingInstructionsListComponent;
  let fixture: ComponentFixture<StandingInstructionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandingInstructionsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandingInstructionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
