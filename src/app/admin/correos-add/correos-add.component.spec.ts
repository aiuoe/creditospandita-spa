import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorreosAddComponent } from './correos-add.component';

describe('CorreosAddComponent', () => {
  let component: CorreosAddComponent;
  let fixture: ComponentFixture<CorreosAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorreosAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorreosAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
