import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingTransactionsComponent } from './saving-transactions.component';

describe('SavingTransactionsComponent', () => {
  let component: SavingTransactionsComponent;
  let fixture: ComponentFixture<SavingTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavingTransactionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavingTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
