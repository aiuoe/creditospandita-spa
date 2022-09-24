import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NovacionComponent } from './novacion.component';

describe('NovacionComponent', () => {
  let component: NovacionComponent;
  let fixture: ComponentFixture<NovacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NovacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NovacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
