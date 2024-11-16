import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashVoucherPassingComponent } from './cash-voucher-passing.component';

describe('CashVoucherPassingComponent', () => {
  let component: CashVoucherPassingComponent;
  let fixture: ComponentFixture<CashVoucherPassingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashVoucherPassingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CashVoucherPassingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
