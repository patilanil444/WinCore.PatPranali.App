import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterCashPaymentComponent } from './counter-cash-payment.component';

describe('CounterCashPaymentComponent', () => {
  let component: CounterCashPaymentComponent;
  let fixture: ComponentFixture<CounterCashPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CounterCashPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterCashPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
