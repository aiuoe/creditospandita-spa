import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UseAddAdminComponent } from './use-add-admin.component';

describe('UseAddAdminComponent', () => {
  let component: UseAddAdminComponent;
  let fixture: ComponentFixture<UseAddAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UseAddAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UseAddAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
