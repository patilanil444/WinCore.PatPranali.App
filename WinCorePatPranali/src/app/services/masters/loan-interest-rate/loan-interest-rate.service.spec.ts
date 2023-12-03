import { TestBed } from '@angular/core/testing';

import { LoanInterestRateService } from './loan-interest-rate.service';

describe('LoanInterestRateService', () => {
  let service: LoanInterestRateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanInterestRateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
