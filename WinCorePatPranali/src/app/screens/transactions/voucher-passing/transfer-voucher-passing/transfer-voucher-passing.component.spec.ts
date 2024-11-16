import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferVoucherPassingComponent } from './transfer-voucher-passing.component';

describe('TransferVoucherPassingComponent', () => {
  let component: TransferVoucherPassingComponent;
  let fixture: ComponentFixture<TransferVoucherPassingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferVoucherPassingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferVoucherPassingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
