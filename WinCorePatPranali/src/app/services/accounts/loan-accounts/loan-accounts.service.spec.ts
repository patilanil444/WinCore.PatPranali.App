import { TestBed } from '@angular/core/testing';

import { LoanAccountsService } from './loan-accounts.service';

describe('LoanAccountsService', () => {
  let service: LoanAccountsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanAccountsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
