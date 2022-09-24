import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParascoreComponent } from './parascore.component';

describe('ParascoreComponent', () => {
  let component: ParascoreComponent;
  let fixture: ComponentFixture<ParascoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParascoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParascoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
