import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, FileText, Send, Lightbulb, MessageSquare, TrendingUp, Users, PenTool, Rocket } from 'lucide-angular';
import { PostsChartComponent } from './components/posts-chart/posts-chart.component';

import { PostService } from '../../services/post.service';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule,
    PostsChartComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  posts: any[] = [];
  campaigns: any[] = [];
  stats: any = {
    totalPosts: 0,
    publishedPosts: 0,
    activeCampaigns: 0
  };

  loading = true;
  recentActivity: any[] = [];

  icons = {
    fileText: FileText,
    send: Send,
    lightbulb: Lightbulb,
    messageSquare: MessageSquare,
    trendingUp: TrendingUp,
    users: Users,
    penTool: PenTool,
    rocket: Rocket
  };

  constructor(
    private postService: PostService,
    private campaignService: CampaignService
  ) {}

  ngOnInit() {
    this.loadPosts();
    this.loadStats();
    this.loadCampaigns();
    this.loadRecentActivity();
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
    this.postService.getPostStats().subscribe({
      next: (res) => {
        this.stats = {
          totalPosts: res.totalPosts || res.total || 0,
          publishedPosts: res.publishedPosts || res.published || 0,
          activeCampaigns: res.campaigns || 0,
          draftPosts: res.draftPosts || 0,
          approvedPosts: res.approvedPosts || 0
        };
      },
      error: () => {
        this.stats = {
          totalPosts: 0,
          publishedPosts: 0,
          activeCampaigns: 0
        };
      }
    });
  }

  loadCampaigns() {
    this.campaignService.getAll().subscribe({
      next: (res) => {
        this.campaigns = res.slice(0, 4);
      },
      error: () => {}
    });
  }

  loadRecentActivity() {
    this.recentActivity = [];
  }

  getPostTrend(): number {
    if (!this.stats?.totalPosts || this.stats.totalPosts === 0) return 0;
    return 0;
  }

  getEngagementRate(): number {
    if (!this.stats?.publishedPosts || this.stats.publishedPosts === 0) return 0;
    return 0;
  }

  getQuickInsight(): string {
    if (!this.posts || this.posts.length === 0) {
      return 'No strong performing posts yet. Start publishing consistently to unlock insights and understand your audience better.';
    }

    const totalLikes = this.posts.reduce((sum, p: any) => sum + (p.likes || 0), 0);
    const totalComments = this.posts.reduce((sum, p: any) => sum + (p.commentsCount || 0), 0);

    const avgLikes = totalLikes / this.posts.length;
    const avgComments = totalComments / this.posts.length;

    if (avgLikes > 100 || avgComments > 20) {
      return 'Your content is performing strongly. Posts are generating solid engagement.';
    }

    if (avgLikes > 40 || avgComments > 5) {
      return 'Your content shows moderate engagement. Consistency can be improved.';
    }

    return 'Engagement levels are low. Focus on clearer messaging and more engaging content.';
  }
}