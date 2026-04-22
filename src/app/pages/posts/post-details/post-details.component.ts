import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../../../services/post.service';
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

  // ✅ NEW
  saving = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private route: ActivatedRoute,
    private service: PostService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.service.getById(+id).subscribe({
        next: (res: any) => {
          this.post = res;
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Failed to load post';
          this.loading = false;
        }
      });
    }
  }

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
        this.successMessage = 'Post updated successfully ✅';
        this.editMode = false;
        this.saving = false;
      },
      error: (err) => {
        this.saving = false;

        // ✅ show backend message if exists
        this.errorMessage =
          err?.error?.message || 'Update failed ❌';
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
      // ✅ update preview instantly
      this.post.imageUrl = res.imageUrl;

      this.generatingImage = false;
      this.successMessage = 'New image generated 🎨';
    },
    error: () => {
      this.generatingImage = false;
      this.errorMessage = 'Image generation failed ❌';
    }
  });
}

  goBack() {
    this.location.back();
  }
}