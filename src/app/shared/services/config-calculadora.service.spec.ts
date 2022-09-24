import { TestBed } from '@angular/core/testing';

import { ConfigCalculadoraService } from './config-calculadora.service';

describe('ConfigCalculadoraService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConfigCalculadoraService = TestBed.get(ConfigCalculadoraService);
    expect(service).toBeTruthy();
  });
});
