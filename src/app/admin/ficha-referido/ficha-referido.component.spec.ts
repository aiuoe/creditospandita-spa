import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaReferidoComponent } from './ficha-referido.component';

describe('FichaReferidoComponent', () => {
  let component: FichaReferidoComponent;
  let fixture: ComponentFixture<FichaReferidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaReferidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaReferidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
