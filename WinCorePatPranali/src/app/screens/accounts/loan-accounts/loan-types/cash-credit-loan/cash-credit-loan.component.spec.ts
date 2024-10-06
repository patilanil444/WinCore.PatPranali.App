import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashCreditLoanComponent } from './cash-credit-loan.component';

describe('CashCreditLoanComponent', () => {
  let component: CashCreditLoanComponent;
  let fixture: ComponentFixture<CashCreditLoanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashCreditLoanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashCreditLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
