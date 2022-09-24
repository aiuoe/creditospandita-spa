import { TestBed } from '@angular/core/testing';

import { AdicionalService } from './adicional.service';

describe('AdicionalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdicionalService = TestBed.get(AdicionalService);
    expect(service).toBeTruthy();
  });
});
