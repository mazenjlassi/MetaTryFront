import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatternService } from '../../services/pattern.service';

@Component({
  selector: 'app-scraped-posts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scraped-posts.component.html',
  styleUrls: ['./scraped-posts.component.css']
})
export class ScrapedPostsComponent implements OnInit {

  companies: string[] = [];
  selectedCompany: string = '';
  scrapedPosts: any[] = [];
  loading = false;
  error = '';
  showAddModal = false;

  newPost: any = {
    companyName: '',
    platform: 'LINKEDIN',
    postText: '',
    topic: '',
    postUrl: '',
    postedAt: ''
  };

  constructor(private patternService: PatternService) {}

  ngOnInit() {
    this.loadCompanies();
  }

  loadCompanies() {
    this.patternService.getCompanies().subscribe({
      next: (res) => {
        this.companies = res;
        if (this.companies.length > 0 && !this.selectedCompany) {
          this.selectCompany(this.companies[0]);
        }
      },
      error: () => {}
    });
  }

  selectCompany(name: string) {
    this.selectedCompany = name;
    this.loadScrapedPosts();
  }

  loadScrapedPosts() {
    if (!this.selectedCompany) return;
    this.loading = true;
    this.patternService.getScrapedPosts(this.selectedCompany).subscribe({
      next: (res) => {
        this.scrapedPosts = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Failed to load scraped posts';
      }
    });
  }

  openAddModal() {
    this.newPost = {
      companyName: this.selectedCompany || '',
      platform: 'LINKEDIN',
      postText: '',
      topic: '',
      postUrl: '',
      postedAt: ''
    };
    this.showAddModal = true;
  }

  createPost() {
    if (!this.newPost.postText || !this.newPost.companyName) return;

    const payload: any = {
      companyName: this.newPost.companyName,
      platform: this.newPost.platform,
      postText: this.newPost.postText,
      topic: this.newPost.topic || 'General',
    };
    if (this.newPost.postUrl) payload.postUrl = this.newPost.postUrl;
    if (this.newPost.postedAt) payload.postedAt = this.newPost.postedAt;

    this.patternService.createScrapedPost(payload).subscribe({
      next: (res) => {
        this.scrapedPosts.unshift(res);
        this.showAddModal = false;
        if (!this.companies.includes(res.companyName)) {
          this.companies.push(res.companyName);
        }
        if (!this.selectedCompany) {
          this.selectCompany(res.companyName);
        }
      },
      error: () => {
        this.error = 'Failed to create post';
      }
    });
  }

  showCompanyInput = false;
  newCompanyName = '';

  toggleCompanyInput() {
    this.showCompanyInput = !this.showCompanyInput;
    if (this.showCompanyInput) {
      this.newCompanyName = '';
    }
  }

  addNewCompany() {
    const trimmed = this.newCompanyName.trim();
    if (!trimmed) return;
    if (!this.companies.includes(trimmed)) {
      this.companies.push(trimmed);
    }
    this.selectCompany(trimmed);
    this.showCompanyInput = false;
    this.newCompanyName = '';
  }

  deletePost(id: number) {
    if (!confirm('Delete this scraped post?')) return;
    this.patternService.deleteScrapedPost(id).subscribe({
      next: () => {
        this.scrapedPosts = this.scrapedPosts.filter(p => p.id !== id);
      },
      error: () => {
        this.error = 'Failed to delete post';
      }
    });
  }

  getPlatformColor(platform: string): string {
    switch(platform?.toLowerCase()) {
      case 'linkedin': return '#0A66C2';
      case 'instagram': return '#E4405F';
      case 'facebook': return '#1877F2';
      default: return '#64748B';
    }
  }
}
