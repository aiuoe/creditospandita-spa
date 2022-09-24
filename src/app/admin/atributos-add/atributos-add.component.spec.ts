import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtributosAddComponent } from './atributos-add.component';

describe('AtributosAddComponent', () => {
  let component: AtributosAddComponent;
  let fixture: ComponentFixture<AtributosAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtributosAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtributosAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
