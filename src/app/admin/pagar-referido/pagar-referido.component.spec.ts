import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagarReferidoComponent } from './pagar-referido.component';

describe('PagarReferidoComponent', () => {
  let component: PagarReferidoComponent;
  let fixture: ComponentFixture<PagarReferidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagarReferidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagarReferidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
