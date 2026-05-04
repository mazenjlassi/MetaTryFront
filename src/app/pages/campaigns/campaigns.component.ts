import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CampaignService } from '../../services/campaign.service';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css']
})
export class CampaignsComponent {

  name = '';
  topic = '';
  postNumber = 1;

  campaignId: number | null = null;

  showManual = false;
  loading = false;

  posts: any[] = [];

  previewUrl: string | null = null;
  selectedFile!: File;

  manualPost: any = {
    title: '',
    content: '',
    hashtags: '',
    platform: 'LINKEDIN',
    scheduledAt: null,
    permanent: false
  };

  constructor(
    private campaignService: CampaignService,
    private postService: PostService
  ) {}

  // ================= CAMPAIGN =================

  createManualCampaign() {

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
      error: () => this.loading = false
    });
  }

  // ================= FILE =================

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      this.previewUrl = URL.createObjectURL(this.selectedFile);
    }
  }

  // ================= CREATE POST =================

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
      .createPostWithImage(this.campaignId, data, this.selectedFile)
      .subscribe({
        next: (res: any) => {

          this.posts.push(res);

          // reset form
          this.manualPost = {
            title: '',
            content: '',
            hashtags: '',
            platform: 'LINKEDIN',
            scheduledAt: null,
            permanent: false
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

  // ================= SAVE =================

  save(post: any) {

    this.postService.updatePost(post.id, post).subscribe({
      next: () => {
        alert('Saved!');
      }
    });
  }

  // ================= PUBLISH =================

  publishNow(post: any) {

    this.postService.publishPost(post.id).subscribe({
      next: () => {
        post.status = 'PUBLISHED';
        post.publishedAt = new Date();
        alert('Published!');
      }
    });
  }

  // ================= AI =================

  generate() {

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
      error: () => this.loading = false
    });
  }
}