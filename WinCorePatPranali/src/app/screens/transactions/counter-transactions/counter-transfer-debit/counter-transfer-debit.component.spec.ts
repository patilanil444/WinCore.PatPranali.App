import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterTransferDebitComponent } from './counter-transfer-debit.component';

describe('CounterTransferDebitComponent', () => {
  let component: CounterTransferDebitComponent;
  let fixture: ComponentFixture<CounterTransferDebitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CounterTransferDebitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterTransferDebitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
