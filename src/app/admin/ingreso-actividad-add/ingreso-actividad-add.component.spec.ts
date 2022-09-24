import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoActividadAddComponent } from './ingreso-actividad-add.component';

describe('IngresoActividadAddComponent', () => {
  let component: IngresoActividadAddComponent;
  let fixture: ComponentFixture<IngresoActividadAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngresoActividadAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresoActividadAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
