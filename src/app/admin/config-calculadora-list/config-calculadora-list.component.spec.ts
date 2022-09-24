import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigCalculadoraListComponent } from './config-calculadora-list.component';

describe('ConfigCalculadoraListComponent', () => {
  let component: ConfigCalculadoraListComponent;
  let fixture: ComponentFixture<ConfigCalculadoraListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigCalculadoraListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigCalculadoraListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
