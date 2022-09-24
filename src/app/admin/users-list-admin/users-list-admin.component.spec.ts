import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersListAdminComponent } from './users-list-admin.component';

describe('UsersListAdminComponent', () => {
  let component: UsersListAdminComponent;
  let fixture: ComponentFixture<UsersListAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersListAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersListAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
