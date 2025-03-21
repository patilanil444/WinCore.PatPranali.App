import { TestBed } from '@angular/core/testing';

import { PigmyAccountService } from './pigmy-account.service';

describe('PigmyAccountService', () => {
  let service: PigmyAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PigmyAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
