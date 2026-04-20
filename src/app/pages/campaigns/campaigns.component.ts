import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CampaignService } from '../../services/campaign.service';
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

  constructor(private campaignService: CampaignService) {}

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

  // 🔥 disable save logic
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
      // remove from UI instantly
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
}