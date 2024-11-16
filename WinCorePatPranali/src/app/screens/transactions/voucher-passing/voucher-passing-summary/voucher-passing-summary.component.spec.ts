import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherPassingSummaryComponent } from './voucher-passing-summary.component';

describe('VoucherPassingSummaryComponent', () => {
  let component: VoucherPassingSummaryComponent;
  let fixture: ComponentFixture<VoucherPassingSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoucherPassingSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoucherPassingSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
