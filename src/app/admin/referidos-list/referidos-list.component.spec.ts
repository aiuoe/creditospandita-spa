import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferidosListComponent } from './referidos-list.component';

describe('ReferidosListComponent', () => {
  let component: ReferidosListComponent;
  let fixture: ComponentFixture<ReferidosListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferidosListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferidosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
