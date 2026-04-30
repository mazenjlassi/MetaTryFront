import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  private apiUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) {}

  // 🔥 KEEP (used for generation flow)
  generateCampaign(data: any) {
    return this.http.post(`${this.apiUrl}/campaigns/generate`, data);
  }

  // ================= CAMPAIGNS =================

  getAll() {
    return this.http.get<any[]>(`${this.apiUrl}/campaigns`);
  }

  getById(id: number) {
    return this.http.get<any>(`${this.apiUrl}/campaigns/${id}`);
  }

  // 🔥 NEW: get posts of a campaign (for CampaignDetails)
  getCampaignPosts(id: number) {
    return this.http.get<any[]>(`${this.apiUrl}/campaigns/${id}/posts`);
  }

  // 🔥 NEW: get campaign insights
  getCampaignInsights(id: number) {
    return this.http.get<any>(`${this.apiUrl}/insights/campaign/${id}`);
  }

  // ================= POSTS =================

  updatePost(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/posts/${id}`, data, {
      responseType: 'text'
    });
  }

  generateImage(postId: number) {
    return this.http.post(`${this.apiUrl}/posts/${postId}/generate-image`, {});
  }

  deletePost(id: number) {
    return this.http.delete(`${this.apiUrl}/posts/${id}`, {
      responseType: 'text'
    });
  }
}