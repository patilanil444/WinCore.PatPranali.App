import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PigmyTransactionsComponent } from './pigmy-transactions.component';

describe('PigmyTransactionsComponent', () => {
  let component: PigmyTransactionsComponent;
  let fixture: ComponentFixture<PigmyTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PigmyTransactionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PigmyTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
