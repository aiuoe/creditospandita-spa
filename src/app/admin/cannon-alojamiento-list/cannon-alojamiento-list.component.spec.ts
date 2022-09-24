import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CannonAlojamientoListComponent } from './cannon-alojamiento-list.component';

describe('CannonAlojamientoListComponent', () => {
  let component: CannonAlojamientoListComponent;
  let fixture: ComponentFixture<CannonAlojamientoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CannonAlojamientoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CannonAlojamientoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
