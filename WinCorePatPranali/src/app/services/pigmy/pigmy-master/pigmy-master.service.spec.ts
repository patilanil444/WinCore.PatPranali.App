import { TestBed } from '@angular/core/testing';

import { PigmyMasterService } from './pigmy-master.service';

describe('PigmyMasterService', () => {
  let service: PigmyMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PigmyMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
