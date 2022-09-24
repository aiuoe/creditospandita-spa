import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigCalculadoraAddComponent } from './config-calculadora-add.component';

describe('ConfigCalculadoraAddComponent', () => {
  let component: ConfigCalculadoraAddComponent;
  let fixture: ComponentFixture<ConfigCalculadoraAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigCalculadoraAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigCalculadoraAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
