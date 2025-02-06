import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartOfWorkSummaryComponent } from './start-of-work-summary.component';

describe('StartOfWorkSummaryComponent', () => {
  let component: StartOfWorkSummaryComponent;
  let fixture: ComponentFixture<StartOfWorkSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartOfWorkSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartOfWorkSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
