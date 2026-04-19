import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostCardComponent } from './components/post-card/post-card.component';
import { PostService } from '../../services/post.service';
import { PostsChartComponent } from './components/posts-chart/posts-chart.component';
import { PlatformChartComponent } from './components/platform-chart/platform-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PostCardComponent, PostsChartComponent, PlatformChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  posts: any[] = [];
  loading = true;

  constructor(private postService: PostService) {}

  ngOnInit() {
  this.postService.getTopPosts().subscribe({
    next: (res) => {
      this.posts = res;
      this.loading = false;
    },
    error: () => {
      this.loading = false;
    }
  });
}
}