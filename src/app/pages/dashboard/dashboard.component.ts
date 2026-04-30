import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostCardComponent } from './components/post-card/post-card.component';
import { PostsChartComponent } from './components/posts-chart/posts-chart.component';
import { PlatformChartComponent } from './components/platform-chart/platform-chart.component';

import { PostService } from '../../services/post.service';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    PostCardComponent,
    PostsChartComponent,
    PlatformChartComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  posts: any[] = [];
  campaigns: any[] = [];
  stats: any;

  loading = true;

  constructor(
    private postService: PostService,
    private campaignService: CampaignService
  ) {}

  ngOnInit() {
    this.loadPosts();
    this.loadStats();
    this.loadCampaigns();
  }

  loadPosts() {
    this.postService.getTopPosts().subscribe({
      next: (res) => {
        this.posts = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  loadStats() {
    this.postService.getPostStats().subscribe(res => {
      this.stats = res;
    });
  }

  loadCampaigns() {
    this.campaignService.getAll().subscribe(res => {
      this.campaigns = res.slice(0, 3);
    });
  }
getQuickInsight(): string {

  if (!this.posts || this.posts.length === 0) {
    return 'No strong performing posts yet. Start publishing consistently to unlock insights and understand your audience better.';
  }

  const totalLikes = this.posts.reduce((sum, p) => sum + (p.likes || 0), 0);
  const totalComments = this.posts.reduce((sum, p) => sum + (p.commentsCount || 0), 0);
  const totalShares = this.posts.reduce((sum, p) => sum + (p.shares || 0), 0);

  const avgLikes = totalLikes / this.posts.length;
  const avgComments = totalComments / this.posts.length;
  const avgShares = totalShares / this.posts.length;

  const best = this.posts[0];

  //  HIGH PERFORMANCE
  if (avgLikes > 100 || avgComments > 20) {
    return `Your content is performing strongly. Posts are generating solid engagement, especially in likes and interactions. 
    This indicates that your messaging resonates well with your audience. 
    Consider scaling this content style and doubling down on similar formats or topics to maximize reach.`;
  }

  //  MEDIUM PERFORMANCE
  if (avgLikes > 40 || avgComments > 5) {
    return `Your content shows moderate engagement. While some posts perform well, consistency can be improved. 
    Try strengthening your hooks, using more engaging visuals, and encouraging interaction through questions or calls-to-action.`;
  }

  //  LOW PERFORMANCE
  return `Engagement levels are currently low. Your content may not be capturing attention effectively. 
  Focus on clearer messaging, shorter formats, and more emotionally engaging content. 
  Testing different tones or storytelling approaches could significantly improve performance.`;
}
}