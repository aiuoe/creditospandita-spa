import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionAddComponent } from './evaluacion-add.component';

describe('EvaluacionAddComponent', () => {
  let component: EvaluacionAddComponent;
  let fixture: ComponentFixture<EvaluacionAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluacionAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluacionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
