import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntasAddComponent } from './preguntas-add.component';

describe('PreguntasAddComponent', () => {
  let component: PreguntasAddComponent;
  let fixture: ComponentFixture<PreguntasAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreguntasAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreguntasAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
