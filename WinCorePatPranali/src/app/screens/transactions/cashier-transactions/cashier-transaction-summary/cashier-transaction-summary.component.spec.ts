import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierTransactionSummaryComponent } from './cashier-transaction-summary.component';

describe('CashierTransactionSummaryComponent', () => {
  let component: CashierTransactionSummaryComponent;
  let fixture: ComponentFixture<CashierTransactionSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashierTransactionSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashierTransactionSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
