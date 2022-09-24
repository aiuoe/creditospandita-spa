import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursedComponent } from './disbursed.component';

describe('DisbursedComponent', () => {
  let component: DisbursedComponent;
  let fixture: ComponentFixture<DisbursedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisbursedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisbursedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
