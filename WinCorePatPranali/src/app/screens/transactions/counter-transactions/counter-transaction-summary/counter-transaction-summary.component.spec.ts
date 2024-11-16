import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterTransactionSummaryComponent } from './counter-transaction-summary.component';

describe('CounterTransactionSummaryComponent', () => {
  let component: CounterTransactionSummaryComponent;
  let fixture: ComponentFixture<CounterTransactionSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CounterTransactionSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterTransactionSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
