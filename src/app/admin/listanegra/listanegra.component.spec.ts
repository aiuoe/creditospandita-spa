import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListanegraComponent } from './listanegra.component';

describe('ListanegraComponent', () => {
  let component: ListanegraComponent;
  let fixture: ComponentFixture<ListanegraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListanegraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListanegraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
