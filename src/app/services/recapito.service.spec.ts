import { TestBed } from '@angular/core/testing';

import { RecapitoService } from './recapito.service';

describe('RecapitoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecapitoService = TestBed.get(RecapitoService);
    expect(service).toBeTruthy();
  });
});
