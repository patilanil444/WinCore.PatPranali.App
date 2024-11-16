import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterTransferCreditComponent } from './counter-transfer-credit.component';

describe('CounterTransferCreditComponent', () => {
  let component: CounterTransferCreditComponent;
  let fixture: ComponentFixture<CounterTransferCreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CounterTransferCreditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CounterTransferCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
