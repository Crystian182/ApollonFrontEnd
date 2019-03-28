import { TestBed } from '@angular/core/testing';

import { CentralinaService } from './centralina.service';

describe('CentralinaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CentralinaService = TestBed.get(CentralinaService);
    expect(service).toBeTruthy();
  });
});
