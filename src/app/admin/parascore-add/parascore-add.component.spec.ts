import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParascoreAddComponent } from './parascore-add.component';

describe('ParascoreAddComponent', () => {
  let component: ParascoreAddComponent;
  let fixture: ComponentFixture<ParascoreAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParascoreAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParascoreAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
