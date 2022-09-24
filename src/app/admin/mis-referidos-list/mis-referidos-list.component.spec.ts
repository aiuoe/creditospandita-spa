import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisReferidosListComponent } from './mis-referidos-list.component';

describe('MisReferidosListComponent', () => {
  let component: MisReferidosListComponent;
  let fixture: ComponentFixture<MisReferidosListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisReferidosListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisReferidosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
