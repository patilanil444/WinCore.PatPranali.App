import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierCashTransferComponent } from './cashier-cash-transfer.component';

describe('CashierCashTransferComponent', () => {
  let component: CashierCashTransferComponent;
  let fixture: ComponentFixture<CashierCashTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashierCashTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashierCashTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
