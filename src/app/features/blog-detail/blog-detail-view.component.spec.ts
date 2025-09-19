import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlogDetailViewComponent } from './blog-detail-view.component';
import { RouterTestingModule } from '@angular/router/testing';
import { type BlogDetailEntry } from '../../core/models';

const mockDetail: BlogDetailEntry = {
  id: 1,
  title: 'Detail Blog',
  content: 'Lorem ipsum dolor sit amet',
  author: 'Admin',
  likes: 5,
  comments: [],
  headerImageUrl: '',
  createdAt: '2022-03-10T12:15:50',
  updatedAt: '2022-03-10T12:15:50',
};

describe('BlogDetailViewComponent (Dumb)', () => {
  let fixture: ComponentFixture<BlogDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogDetailViewComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogDetailViewComponent);
  });

  it('should render blog details when input is provided', () => {
    fixture.componentRef.setInput('blog', mockDetail);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('h1')?.textContent).toContain('Blog Detail');
    expect(root.querySelector('h2')?.textContent).toContain(mockDetail.title);

    const idP = Array.from(root.querySelectorAll('p')).find((p) =>
      (p.textContent || '').includes('ID:'),
    );
    expect(idP?.textContent).toContain(String(mockDetail.id));
  });

  it('should show not-found when blog is null', () => {
    fixture.componentRef.setInput('blog', null);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('.not-found')).toBeTruthy();
  });
});
