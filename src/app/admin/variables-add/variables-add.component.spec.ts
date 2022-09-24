import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariablesAddComponent } from './variables-add.component';

describe('VariablesAddComponent', () => {
  let component: VariablesAddComponent;
  let fixture: ComponentFixture<VariablesAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariablesAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariablesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
