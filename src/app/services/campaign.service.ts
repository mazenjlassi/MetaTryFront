import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  private apiUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) {}

  generateCampaign(data: any) {
    return this.http.post(`${this.apiUrl}/campaigns/generate`, data);
  }

  updatePost(id: number, data: any) {
  return this.http.put(`http://localhost:8081/posts/${id}`, data, {
    responseType: 'text'
  });
}

  generateImage(postId: number) {
    return this.http.post(`${this.apiUrl}/posts/${postId}/generate-image`, {});
  }

deletePost(id: number) {
  return this.http.delete(`http://localhost:8081/posts/${id}`, {
    responseType: 'text'
  });
}
}