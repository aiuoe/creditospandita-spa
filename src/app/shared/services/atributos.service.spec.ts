import { TestBed } from '@angular/core/testing';

import { AtributosService } from './atributos.service';

describe('AtributosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AtributosService = TestBed.get(AtributosService);
    expect(service).toBeTruthy();
  });
});
