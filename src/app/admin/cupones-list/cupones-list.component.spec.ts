import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuponesListComponent } from './cupones-list.component';

describe('CuponesListComponent', () => {
  let component: CuponesListComponent;
  let fixture: ComponentFixture<CuponesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuponesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuponesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
