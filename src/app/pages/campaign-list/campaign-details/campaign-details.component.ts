import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CampaignService } from '../../../services/campaign.service';
import { PostService } from '../../../services/post.service';
import { InsightService } from '../../../services/insight.service';

@Component({
  selector: 'app-campaign-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.css']
})
export class CampaignDetailsComponent implements OnInit {

  campaign: any = null;
  posts: any[] = [];
  insights: any = null;

  loading = true;

  private campaignId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private campaignService: CampaignService,
    private postService: PostService,
    private insightService: InsightService
  ) {}

  ngOnInit(): void {
    this.campaignId = Number(this.route.snapshot.params['id']);

    this.loadCampaign();
    this.loadPosts();
    this.loadInsights();
  }

  // ================= LOADERS =================

  loadCampaign() {
    this.campaignService.getById(this.campaignId).subscribe({
      next: (res) => this.campaign = res,
      error: () => console.error('Failed to load campaign')
    });
  }

  loadPosts() {
    this.postService.getByCampaign(this.campaignId).subscribe({
      next: (res) => {
        this.posts = res;
        this.loading = false;
      },
      error: () => {
        console.error('Failed to load posts');
        this.loading = false;
      }
    });
  }

  loadInsights() {
    this.insightService.getByCampaign(this.campaignId).subscribe({
      next: (res) => this.insights = res,
      error: () => console.error('Failed to load insights')
    });
  }

  // 🔄 OPTIONAL: reload insights (useful for button later)
  reloadInsights() {
    this.loadInsights();
  }

  // ================= NAVIGATION =================

  openPost(id: number) {
    this.router.navigate(['/posts', id]);
  }

  editPost(post: any) {
    post.editing = !post.editing;
  }

  publishPost(post: any) {
    this.postService.updatePost(post.id, { status: 'PUBLISHED' }).subscribe({
      next: () => {
        post.status = 'PUBLISHED';
      }
    });
  }

  goBack() {
    this.router.navigate(['/campaign-list']);
  }
}