import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { signal } from '@angular/core';

import { BlogComponent } from './blog.component';
import { BlogStore } from '../../core/state/blog.store';
import { type BlogPreviewEntry } from '../../core/models';

describe('BlogComponent', () => {
  let fixture: ComponentFixture<BlogComponent>;
  let component: BlogComponent;

  const mockBlogs: BlogPreviewEntry[] = [
    {
      id: 1,
      title: 'Test Blog',
      contentPreview: 'Teaser…',
      author: 'Tester',
      likes: 3,
      comments: 0,
      headerImageUrl: '',
    },
  ];

  const mockStore = {
    blogs: signal<BlogPreviewEntry[]>(mockBlogs),
    loading: signal<boolean>(false),
    loadBlogs: jasmine.createSpy('loadBlogs'),
    selectBlog: jasmine.createSpy('selectBlog'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogComponent, RouterTestingModule],
      providers: [{ provide: BlogStore, useValue: mockStore }],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose blogs and isLoading via getters', () => {
    expect(component.blogs.length).toBe(1);
    expect(component.isLoading).toBeFalse();
  });

  it('should render blog title in template', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent || '').toContain('Test Blog');
  });
});
