import { TestBed } from '@angular/core/testing';

import { VoucherPassingService } from './voucher-passing.service';

describe('VoucherPassingService', () => {
  let service: VoucherPassingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoucherPassingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
