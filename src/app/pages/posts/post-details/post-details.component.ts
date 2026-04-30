import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../../services/post.service';
import { CommentService } from '../../../services/comment.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {

  post: any;
  loading = true;
  editMode = false;

  saving = false;
  errorMessage = '';
  successMessage = '';

  comments: any[] = [];
  loadingComments = false;

  constructor(
    private route: ActivatedRoute,
    private service: PostService,
    private commentService: CommentService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      const postId = +id;

      this.service.getById(postId).subscribe({
        next: (res: any) => {
          this.post = res;
          this.loading = false;

          // Only load comments if published
          if (this.post.status === 'PUBLISHED') {
            this.loadComments(postId);
          }
        },
        error: () => {
          this.errorMessage = 'Failed to load post';
          this.loading = false;
        }
      });
    }
  }

  // ================= COMMENTS =================

  loadComments(postId: number) {
    this.loadingComments = true;

    this.commentService.getByPost(postId).subscribe({
      next: (res) => {
        this.comments = res;
        this.loadingComments = false;
      },
      error: () => {
        this.loadingComments = false;
      }
    });
  }

  filterSentiment(sentiment: string) {
    if (!this.post?.id) return;

    this.loadingComments = true;

    this.commentService
      .getByPostAndSentiment(this.post.id, sentiment)
      .subscribe({
        next: (res) => {
          this.comments = res;
          this.loadingComments = false;
        },
        error: () => {
          this.loadingComments = false;
        }
      });
  }

  resetComments() {
    if (!this.post?.id) return;
    this.loadComments(this.post.id);
  }

  getSentimentClass(sentiment: string): string {
    if (sentiment === 'POSITIVE') return 'positive';
    if (sentiment === 'NEGATIVE') return 'negative';
    return 'neutral';
  }

  // ================= POST =================

  canUpdate(): boolean {
    return this.post?.status !== 'PUBLISHED';
  }

  openEdit() {
    this.editMode = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  updatePost() {
    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      title: this.post.title,
      content: this.post.content,
      hashtags: this.post.hashtags
    };

    this.service.updatePost(this.post.id, payload).subscribe({
      next: () => {
        this.successMessage = 'Post updated successfully';
        this.editMode = false;
        this.saving = false;
      },
      error: (err) => {
        this.saving = false;
        this.errorMessage = err?.error?.message || 'Update failed';
      }
    });
  }

  generatingImage = false;

  generateImage() {
    this.generatingImage = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.service.generateImage(this.post.id).subscribe({
      next: (res: any) => {
        this.post.imageUrl = res.imageUrl;
        this.generatingImage = false;
        this.successMessage = 'Image generated successfully';
      },
      error: () => {
        this.generatingImage = false;
        this.errorMessage = 'Image generation failed';
      }
    });
  }

  goBack() {
    this.location.back();
  }
}