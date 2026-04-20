import { Component, OnInit } from '@angular/core';
import { CampaignService } from '../../services/campaign.service';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  posts: any[] = [];
  activeTab: string = 'drafts';
  loading = false;

  constructor(private service :PostService) {}

  ngOnInit() {
    this.loadPosts();
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.loadPosts();
  }

  loadPosts() {
    this.loading = true;

    let request;

    if (this.activeTab === 'drafts') {
      request = this.service.getDrafts();
    } else if (this.activeTab === 'scheduled') {
      request = this.service.getScheduled();
    } else {
      request = this.service.getPublished();
    }

    request.subscribe({
      next: (res: any) => {
        this.posts = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}