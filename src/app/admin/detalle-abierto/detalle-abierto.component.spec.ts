import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAbiertoComponent } from './detalle-abierto.component';

describe('DetalleAbiertoComponent', () => {
  let component: DetalleAbiertoComponent;
  let fixture: ComponentFixture<DetalleAbiertoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleAbiertoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleAbiertoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
