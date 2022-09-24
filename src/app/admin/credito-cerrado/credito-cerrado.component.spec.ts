import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditoCerradoComponent } from './credito-cerrado.component';

describe('CreditoCerradoComponent', () => {
  let component: CreditoCerradoComponent;
  let fixture: ComponentFixture<CreditoCerradoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditoCerradoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditoCerradoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
