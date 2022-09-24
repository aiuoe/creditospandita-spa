import { TestBed } from '@angular/core/testing';

import { ParascoreService } from './parascore.service';

describe('ParascoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParascoreService = TestBed.get(ParascoreService);
    expect(service).toBeTruthy();
  });
});
