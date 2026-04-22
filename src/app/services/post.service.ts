import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private api = 'http://localhost:8081/posts';

  constructor(private http: HttpClient) {}

  getLatestPosts(limit: number = 15) {
    return this.http.get<any[]>(
      `${this.api}/latestPublished?limit=${limit}`
    );
  }

  getTopPosts(limit: number = 5) {
    return this.http.get<any[]>(
      `${this.api}/top?limit=${limit}`
    );
  }

  getPostStats() {
  return this.http.get<any>('http://localhost:8081/posts/stats');
}

getDrafts() {
  return this.http.get('http://localhost:8081/posts/drafts');
}

getScheduled() {
  return this.http.get('http://localhost:8081/posts/scheduled');
}

getPublished() {
  return this.http.get('http://localhost:8081/posts/published');
}

publishPost(postId: number) {
  return this.http.post(`http://localhost:8081/publish/${postId}`, {});
}

getPermanent() {
  return this.http.get('http://localhost:8081/posts/permanent');
}
getById(id: number) {
  return this.http.get(`http://localhost:8081/posts/${id}`);
}
updatePost(id: number, data: any) {
  return this.http.put(`http://localhost:8081/posts/${id}`, data, {
    responseType: 'text'
  });
}
generateImage(id: number) {
  return this.http.post(`http://localhost:8081/posts/${id}/generate-image`, {});
}
}