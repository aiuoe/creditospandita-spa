import { TestBed } from '@angular/core/testing';

import { MorososService } from './morosos.service';

describe('MorososService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MorososService = TestBed.get(MorososService);
    expect(service).toBeTruthy();
  });
});
