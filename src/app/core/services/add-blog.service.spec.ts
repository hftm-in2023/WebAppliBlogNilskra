import { TestBed } from '@angular/core/testing';

import { AddBlogService } from './add-blog.service';

describe('AddBlogService', () => {
  let service: AddBlogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddBlogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
