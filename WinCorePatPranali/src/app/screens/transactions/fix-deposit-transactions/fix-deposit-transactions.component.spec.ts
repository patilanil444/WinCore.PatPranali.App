import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixDepositTransactionsComponent } from './fix-deposit-transactions.component';

describe('FixDepositTransactionsComponent', () => {
  let component: FixDepositTransactionsComponent;
  let fixture: ComponentFixture<FixDepositTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixDepositTransactionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FixDepositTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
