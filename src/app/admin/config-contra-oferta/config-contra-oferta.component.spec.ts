import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigContraOfertaComponent } from './config-contra-oferta.component';

describe('ConfigContraOfertaComponent', () => {
  let component: ConfigContraOfertaComponent;
  let fixture: ComponentFixture<ConfigContraOfertaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigContraOfertaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigContraOfertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
