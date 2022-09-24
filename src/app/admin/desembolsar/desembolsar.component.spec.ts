import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesembolsarComponent } from './desembolsar.component';

describe('DesembolsarComponent', () => {
  let component: DesembolsarComponent;
  let fixture: ComponentFixture<DesembolsarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesembolsarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesembolsarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
