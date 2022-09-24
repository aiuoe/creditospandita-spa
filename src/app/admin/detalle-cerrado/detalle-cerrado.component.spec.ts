import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleCerradoComponent } from './detalle-cerrado.component';

describe('DetalleCerradoComponent', () => {
  let component: DetalleCerradoComponent;
  let fixture: ComponentFixture<DetalleCerradoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleCerradoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleCerradoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
