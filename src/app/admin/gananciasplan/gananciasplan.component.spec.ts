import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GananciasplanComponent } from './gananciasplan.component';

describe('GananciasplanComponent', () => {
  let component: GananciasplanComponent;
  let fixture: ComponentFixture<GananciasplanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GananciasplanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GananciasplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
