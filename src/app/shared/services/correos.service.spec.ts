import { TestBed } from '@angular/core/testing';

import { CorreosService } from './correos.service';

describe('CorreosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CorreosService = TestBed.get(CorreosService);
    expect(service).toBeTruthy();
  });
});
