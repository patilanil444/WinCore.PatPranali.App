import { TestBed } from '@angular/core/testing';

import { PriorityMasterService } from './priority-master.service';

describe('PriorityMasterService', () => {
  let service: PriorityMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PriorityMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
