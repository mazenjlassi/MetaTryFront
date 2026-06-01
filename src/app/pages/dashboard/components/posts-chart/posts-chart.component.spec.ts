import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostsChartComponent } from './posts-chart.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { PostService } from '../../../../services/post.service';

describe('PostsChartComponent', () => {
  let component: PostsChartComponent;
  let fixture: ComponentFixture<PostsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsChartComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        PostService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
