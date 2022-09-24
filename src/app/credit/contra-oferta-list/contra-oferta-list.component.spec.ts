import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContraOfertaListComponent } from './contra-oferta-list.component';

describe('ContraOfertaListComponent', () => {
  let component: ContraOfertaListComponent;
  let fixture: ComponentFixture<ContraOfertaListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContraOfertaListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContraOfertaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
