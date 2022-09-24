import { TestBed } from '@angular/core/testing';

import { ContactsFormService } from './contacts-form.service';

describe('ContactsFormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContactsFormService = TestBed.get(ContactsFormService);
    expect(service).toBeTruthy();
  });
});
