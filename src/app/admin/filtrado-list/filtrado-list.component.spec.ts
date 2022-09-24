import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltradoListComponent } from './filtrado-list.component';

describe('FiltradoListComponent', () => {
  let component: FiltradoListComponent;
  let fixture: ComponentFixture<FiltradoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltradoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltradoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
