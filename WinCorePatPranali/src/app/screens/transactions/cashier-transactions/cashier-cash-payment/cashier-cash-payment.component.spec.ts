import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierCashPaymentComponent } from './cashier-cash-payment.component';

describe('CashierCashPaymentComponent', () => {
  let component: CashierCashPaymentComponent;
  let fixture: ComponentFixture<CashierCashPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashierCashPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashierCashPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
