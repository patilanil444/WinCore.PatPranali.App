import { TestBed } from '@angular/core/testing';

import { CashierTransactionsService } from './cashier-transactions.service';

describe('CashierTransactionsService', () => {
  let service: CashierTransactionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CashierTransactionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
