import { TestBed } from '@angular/core/testing';

import { MenuContextService } from './menu-context.service';

describe('MenuContextService', () => {
  let service: MenuContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
