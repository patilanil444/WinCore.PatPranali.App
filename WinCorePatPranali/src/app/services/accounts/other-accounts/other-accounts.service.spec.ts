import { TestBed } from '@angular/core/testing';

import { OtherAccountsService } from './other-accounts.service';

describe('OtherAccountsService', () => {
  let service: OtherAccountsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OtherAccountsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
