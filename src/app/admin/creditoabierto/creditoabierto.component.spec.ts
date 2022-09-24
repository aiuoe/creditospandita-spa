import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditoabiertoComponent } from './creditoabierto.component';

describe('CreditoabiertoComponent', () => {
  let component: CreditoabiertoComponent;
  let fixture: ComponentFixture<CreditoabiertoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditoabiertoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditoabiertoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
