import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreApprovedComponent } from './pre-approved.component';

describe('PreApprovedComponent', () => {
  let component: PreApprovedComponent;
  let fixture: ComponentFixture<PreApprovedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreApprovedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
