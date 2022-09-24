import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigContraOfertaListComponent } from './config-contra-oferta-list.component';

describe('ConfigContraOfertaListComponent', () => {
  let component: ConfigContraOfertaListComponent;
  let fixture: ComponentFixture<ConfigContraOfertaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigContraOfertaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigContraOfertaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
