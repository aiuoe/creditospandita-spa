import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdicionalListComponent } from './adicional-list.component';

describe('AdicionalListComponent', () => {
  let component: AdicionalListComponent;
  let fixture: ComponentFixture<AdicionalListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdicionalListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdicionalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
