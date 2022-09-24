import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CannonAlojamientoAddComponent } from './cannon-alojamiento-add.component';

describe('CannonAlojamientoAddComponent', () => {
  let component: CannonAlojamientoAddComponent;
  let fixture: ComponentFixture<CannonAlojamientoAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CannonAlojamientoAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CannonAlojamientoAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
