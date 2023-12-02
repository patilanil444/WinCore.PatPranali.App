import { TestBed } from '@angular/core/testing';

import { DepositInterestRateService } from './deposit-interest-rate.service';

describe('DepositInterestRateService', () => {
  let service: DepositInterestRateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepositInterestRateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
