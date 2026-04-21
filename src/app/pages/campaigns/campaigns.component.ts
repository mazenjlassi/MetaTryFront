import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CampaignService } from '../../services/campaign.service';
import { PostService } from '../../services/post.service'; // ✅ ADD THIS
import { CommonModule } from '@angular/common';

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

  posts: any[] = [];
  loading = false;

  savingPostId: number | null = null;
  savedPostId: number | null = null;

  publishingPostId: number | null = null; // ✅ NEW (loading state)

  constructor(
    private campaignService: CampaignService,
    private postService: PostService // ✅ INJECT IT
  ) {}

  generate() {
    this.loading = true;

    const data = {
      name: this.name,
      topic: this.topic,
      postNumber: this.postNumber
    };

    this.campaignService.generateCampaign(data).subscribe({
      next: (res: any) => {
        this.posts = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  save(post: any) {

    if (post.platform === 'INSTAGRAM' && !post.image?.imageUrl) {
      alert('Instagram posts require an image!');
      return;
    }

    this.savingPostId = post.id;

    this.campaignService.updatePost(post.id, post).subscribe({
      next: () => {
        this.savingPostId = null;
        this.savedPostId = post.id;
      },
      error: (err) => {
        this.savingPostId = null;
        console.error('FULL ERROR:', err);
        alert(err.error?.message || 'Save failed');
      }
    });
  }

  generateImage(post: any) {
    this.campaignService.generateImage(post.id).subscribe((res: any) => {
      post.image = res;
    });
  }
  canSave(post: any): boolean {
    if (post.platform === 'INSTAGRAM') {
      return !!post.image?.imageUrl;
    }
    return true;
  }
  delete(post: any) {
    if (!confirm('Delete this post?')) return;

    this.campaignService.deletePost(post.id).subscribe({
      next: () => {
        this.posts = this.posts.filter(p => p.id !== post.id);
      },
      error: (err) => {
        console.error(err);
        alert('Delete failed');
      }
    });
  }

  getPlatformClass(platform: string) {
    return platform.toLowerCase();
  }

publishNow(post: any) {

  this.publishingPostId = post.id;

  this.postService.publishPost(post.id).subscribe({

    next: (res: any) => {
      console.log("Published", res);

      this.markAsPublished(post);

      alert("✅ Post published!");
    },

    error: (err) => {
      console.error("Publish error:", err);

      // 🔥 KEY FIX: detect false errors
      const alreadyPublished =
        err?.error?.id ||              // Facebook response
        err?.error?.mediaId ||         // Instagram
        err?.status === 200;           // sometimes weird cases

      if (alreadyPublished) {
        console.warn("⚠️ Backend error but post likely published");

        this.markAsPublished(post);

        alert("⚠️ Published but backend returned error");
      } else {
        alert(err.error?.message || "❌ Failed to publish");
      }

      this.publishingPostId = null;
    }
  });
}

private markAsPublished(post: any) {
  post.status = 'PUBLISHED';
  post.publishedAt = new Date();
  this.publishingPostId = null;
}
}