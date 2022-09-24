import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsFormListComponent } from './contacts-form-list.component';

describe('ContactsFormListComponent', () => {
  let component: ContactsFormListComponent;
  let fixture: ComponentFixture<ContactsFormListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsFormListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsFormListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
