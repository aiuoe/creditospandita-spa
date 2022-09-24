import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditoprocesoComponent } from './creditoproceso.component';

describe('CreditoprocesoComponent', () => {
  let component: CreditoprocesoComponent;
  let fixture: ComponentFixture<CreditoprocesoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditoprocesoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditoprocesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
