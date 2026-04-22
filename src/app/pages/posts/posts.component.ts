import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';
import { Router } from '@angular/router';

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

  constructor(
    private service: PostService,
    private router: Router // ✅ added
  ) {}

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
    } else if (this.activeTab === 'permanent') {
      request = this.service.getPermanent();
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

  // ✅ NEW METHOD
  viewDetails(id: number) {
    this.router.navigate(['/posts', id]);
  }



// ✅ Business rule
canEdit(post: any): boolean {
  return post.permanent || post.status !== 'PUBLISHED';
}
}