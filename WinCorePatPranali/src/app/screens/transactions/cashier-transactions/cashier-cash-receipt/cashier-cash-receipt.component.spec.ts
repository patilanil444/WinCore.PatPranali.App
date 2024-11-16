import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierCashReceiptComponent } from './cashier-cash-receipt.component';

describe('CashierCashReceiptComponent', () => {
  let component: CashierCashReceiptComponent;
  let fixture: ComponentFixture<CashierCashReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashierCashReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashierCashReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
