import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudfisicaComponent } from './solicitudfisica.component';

describe('SolicitudfisicaComponent', () => {
  let component: SolicitudfisicaComponent;
  let fixture: ComponentFixture<SolicitudfisicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudfisicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudfisicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
