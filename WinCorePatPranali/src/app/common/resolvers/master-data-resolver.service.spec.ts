import { TestBed } from '@angular/core/testing';

import { MasterDataResolverService } from './master-data-resolver.service';

describe('MasterDataResolverService', () => {
  let service: MasterDataResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterDataResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
