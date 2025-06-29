import { TestBed } from '@angular/core/testing';

import { ClockSettings } from './clock-settings';

describe('ClockSettings', () => {
  let service: ClockSettings;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClockSettings);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
