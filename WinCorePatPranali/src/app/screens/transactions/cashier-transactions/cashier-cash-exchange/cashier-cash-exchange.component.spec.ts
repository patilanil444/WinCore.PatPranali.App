import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierCashExchangeComponent } from './cashier-cash-exchange.component';

describe('CashierCashExchangeComponent', () => {
  let component: CashierCashExchangeComponent;
  let fixture: ComponentFixture<CashierCashExchangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashierCashExchangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashierCashExchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
