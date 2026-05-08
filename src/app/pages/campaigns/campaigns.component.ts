import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Image, Loader2, FolderPlus } from 'lucide-angular';

import { CampaignService } from '../../services/campaign.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [FormsModule, CommonModule, LucideAngularModule],
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css']
})
export class CampaignsComponent implements OnInit {

  icons = {
    image: Image,
    loader2: Loader2,
    folderPlus: FolderPlus
  };

  // ================= FORM STATE =================

  showForm = false;
  showExistingMode = false;

  // ================= RECENT CAMPAIGNS =================

  recentCampaigns: any[] = [];
  selectedExistingCampaign: any = null;

  // ================= FILTERS =================

  sortBy = 'newest';

  // ================= CAMPAIGN =================

  name = '';
  topic = '';
  postNumber = 1;

  campaignId: number | null = null;

  showManual = false;
  loading = false;

  // ================= POSTS =================

  posts: any[] = [];

  savingPostId: number | null = null;
  publishingPostId: number | null = null;

  // ================= IMAGE =================

  previewUrl: string | null = null;
  selectedFile!: File;

  // ================= MANUAL POST =================

  manualPost: any = {
    title: '',
    content: '',
    hashtags: '',
    platform: 'LINKEDIN',
    scheduledAt: null,
    permanent: false,
    approved: true,
    link: ''
  };

  constructor(
    private campaignService: CampaignService,
    private postService: PostService
  ) {}

  ngOnInit() {
    this.loadRecentCampaigns();
  }

  // ================= RECENT CAMPAIGNS =================

  loadRecentCampaigns() {
    this.campaignService.getRecent(5).subscribe({
      next: (res) => {
        this.recentCampaigns = res;
      },
      error: () => {}
    });
  }

  onCampaignSelect(event: any) {
    const selectedName = event.target.value;
    const campaign = this.recentCampaigns.find(c => c.name === selectedName);
    
    if (campaign) {
      this.selectedExistingCampaign = campaign;
      this.campaignId = campaign.id;
      this.topic = campaign.topic || '';
      
      // Load posts for this campaign
      this.loadCampaignPosts(campaign.id);
    } else {
      this.selectedExistingCampaign = null;
      this.campaignId = null;
      this.topic = '';
    }
  }

  loadCampaignPosts(campaignId: number) {
    this.campaignService.getCampaignPosts(campaignId).subscribe({
      next: (res) => {
        this.posts = res;
      },
      error: () => {
        this.posts = [];
      }
    });
  }

  enableExistingMode() {
    this.showForm = true;
    this.showExistingMode = true;
    this.name = '';
    this.topic = '';
    this.campaignId = null;
    this.selectedExistingCampaign = null;
    this.posts = [];
    this.loadRecentCampaigns();
  }

  enableNewMode() {
    this.showForm = true;
    this.showExistingMode = false;
    this.name = '';
    this.topic = '';
    this.campaignId = null;
    this.selectedExistingCampaign = null;
    this.posts = [];
  }

  // ================= CREATE MANUAL CAMPAIGN =================

  createManualCampaign() {
    if (this.showExistingMode && this.campaignId) {
      // Adding to existing campaign - just open manual post modal
      this.showManual = true;
      return;
    }

    if (!this.name || !this.topic) {
      alert('Name and topic are required');
      return;
    }

    this.loading = true;

    this.campaignService.createCampaign({
      name: this.name,
      topic: this.topic
    }).subscribe({
      next: (res: any) => {
        this.campaignId = res.id;
        this.loading = false;
        this.showManual = true;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  // ================= FILE =================

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.previewUrl = URL.createObjectURL(this.selectedFile);
    }
  }

  // ================= CREATE MANUAL POST =================

  createManualPost() {
    if (!this.campaignId) return;

    this.loading = true;

    const data = {
      ...this.manualPost,
      scheduledAt: this.manualPost.scheduledAt
        ? new Date(this.manualPost.scheduledAt).toISOString()
        : null
    };

    this.postService
      .createPostWithImage(
        this.campaignId,
        data,
        this.selectedFile
      )
      .subscribe({
        next: (res: any) => {
          this.posts.push(res);
          this.manualPost = {
            title: '',
            content: '',
            hashtags: '',
            platform: 'LINKEDIN',
            scheduledAt: null,
            permanent: false,
            approved: true,
            link: ''
          };
          this.previewUrl = null;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
          alert('Failed to create post');
        }
      });
  }

  // ================= DELETE =================

  delete(post: any) {
    if (!confirm('Delete this post?')) return;

    this.postService.deletePost(post.id).subscribe({
      next: () => {
        this.posts = this.posts.filter(p => p.id !== post.id);
      }
    });
  }

  // ================= EDIT POST =================

  editPost(post: any) {
    post.editing = !post.editing;
  }

  // ================= GENERATE IMAGE =================

  generateImage(post: any) {
    if (!post.content) return;
    
    post.generatingImage = true;

    this.postService.generateImage(post.id).subscribe({
      next: (res: any) => {
        post.imageUrl = res.imageUrl || res.url;
        post.generatingImage = false;
      },
      error: () => {
        post.generatingImage = false;
      }
    });
  }

  // ================= SAVE =================

  save(post: any) {
    this.savingPostId = post.id;

    this.postService.updatePost(post.id, {
      title: post.title,
      content: post.content,
      hashtags: post.hashtags,
      platform: post.platform,
      scheduledAt: post.scheduledAt,
      permanent: post.permanent,
      approved: post.approved,
      link: post.link,
      imageUrl: post.imageUrl
    }).subscribe({
      next: () => {
        this.savingPostId = null;
        alert('Saved!');
      },
      error: () => {
        this.savingPostId = null;
        alert('Failed to save');
      }
    });
  }

  // ================= PUBLISH =================

  publishNow(post: any) {
    this.publishingPostId = post.id;

    this.postService.publishPost(post.id).subscribe({
      next: () => {
        post.status = 'PUBLISHED';
        post.publishedAt = new Date();
        this.publishingPostId = null;
        alert('Published!');
      },
      error: () => {
        this.publishingPostId = null;
        alert('Failed to publish');
      }
    });
  }

  // ================= AI GENERATION =================

  generate() {
    if (this.showExistingMode && this.campaignId) {
      this.loading = true;
      this.campaignService.generateForExisting(this.campaignId, this.postNumber).subscribe({
        next: (res: any) => {
          this.posts = [...this.posts, ...res];
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          alert('Failed to generate posts');
        }
      });
      return;
    }

    this.loading = true;

    this.campaignService.generateCampaign({
      name: this.name,
      topic: this.topic,
      postNumber: this.postNumber
    }).subscribe({
      next: (res: any) => {
        this.posts = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}