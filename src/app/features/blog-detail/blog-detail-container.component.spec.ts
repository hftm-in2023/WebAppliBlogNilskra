import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { BlogDetailContainerComponent } from './blog-detail-container.component';
import { BlogStore } from '../../core/state/blog.store';
import { type BlogDetailEntry } from '../../core/models';

describe('BlogDetailContainerComponent (Smart)', () => {
  it('should render spinner when loading', async () => {
    const mockStore = {
      loading: signal<boolean>(true),
      selected: signal<BlogDetailEntry | null>(null),
    };

    await TestBed.configureTestingModule({
      imports: [BlogDetailContainerComponent],
      providers: [{ provide: BlogStore, useValue: mockStore }],
    }).compileComponents();

    const fixture = TestBed.createComponent(BlogDetailContainerComponent);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('mat-progress-spinner')).toBeTruthy();
    expect(el.querySelector('app-blog-detail-view')).toBeFalsy();
  });

  it('should render detail view when not loading and selected is present', async () => {
    const mockDetail: BlogDetailEntry = {
      id: 42,
      title: 'Detail Title',
      content: 'Content',
      author: 'A',
      likes: 0,
      comments: [],
      headerImageUrl: '',
      createdAt: '2022-03-10T12:15:50',
      updatedAt: '2022-03-10T12:15:50',
    };

    const mockStore = {
      loading: signal<boolean>(false),
      selected: signal<BlogDetailEntry | null>(mockDetail),
    };

    await TestBed.configureTestingModule({
      imports: [BlogDetailContainerComponent],
      providers: [{ provide: BlogStore, useValue: mockStore }],
    }).compileComponents();

    const fixture = TestBed.createComponent(BlogDetailContainerComponent);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('mat-progress-spinner')).toBeFalsy();
    expect(el.querySelector('app-blog-detail-view')).toBeTruthy();
  });
});
