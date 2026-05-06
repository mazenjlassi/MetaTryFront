import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  posts: any[] = [];
  activeTab: string = 'drafts';
  loading = false;
  
  // Search
  searchQuery = '';
  
  // Filtered posts based on search
  get filteredPosts() {
    if (!this.searchQuery) return this.posts;
    
    const q = this.searchQuery.toLowerCase();
    return this.posts.filter(p => 
      p.content?.toLowerCase().includes(q) ||
      p.platform?.toLowerCase().includes(q)
    );
  }

  constructor(
    private service: PostService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPosts();
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.searchQuery = ''; // Clear search on tab change
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

  viewDetails(id: number) {
    this.router.navigate(['/posts', id]);
  }

  canEdit(post: any): boolean {
    return post.permanent || post.status !== 'PUBLISHED';
  }
}