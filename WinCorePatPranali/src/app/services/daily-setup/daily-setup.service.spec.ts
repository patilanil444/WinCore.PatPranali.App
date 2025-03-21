import { TestBed } from '@angular/core/testing';

import { DailySetupService } from './daily-setup.service';

describe('DailySetupService', () => {
  let service: DailySetupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailySetupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
