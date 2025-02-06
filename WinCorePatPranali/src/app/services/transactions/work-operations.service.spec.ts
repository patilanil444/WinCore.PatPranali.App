import { TestBed } from '@angular/core/testing';

import { WorkOperationsService } from './work-operations.service';

describe('WorkOperationsService', () => {
  let service: WorkOperationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkOperationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
