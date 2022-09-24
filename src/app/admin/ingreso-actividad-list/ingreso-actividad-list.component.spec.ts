import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoActividadListComponent } from './ingreso-actividad-list.component';

describe('IngresoActividadListComponent', () => {
  let component: IngresoActividadListComponent;
  let fixture: ComponentFixture<IngresoActividadListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngresoActividadListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresoActividadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
