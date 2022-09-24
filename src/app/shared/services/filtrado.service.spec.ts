import { TestBed } from '@angular/core/testing';

import { FiltradoService } from './filtrado.service';

describe('FiltradoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FiltradoService = TestBed.get(FiltradoService);
    expect(service).toBeTruthy();
  });
});
