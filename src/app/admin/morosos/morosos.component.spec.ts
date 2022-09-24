import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MorososComponent } from './morosos.component';

describe('MorososComponent', () => {
  let component: MorososComponent;
  let fixture: ComponentFixture<MorososComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MorososComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MorososComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
