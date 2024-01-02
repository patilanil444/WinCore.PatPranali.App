import { TestBed } from '@angular/core/testing';

import { TahshilMasterService } from './tahshil-master.service';

describe('TahshilMasterService', () => {
  let service: TahshilMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TahshilMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
