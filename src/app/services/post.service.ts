import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private api = 'http://localhost:8081/posts';

  constructor(private http: HttpClient) {}

  // ================= DASHBOARD =================

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
    return this.http.get<any>(`${this.api}/stats`);
  }

  // ================= FILTERS =================

  getDrafts() {
    return this.http.get<any[]>(`${this.api}/drafts`);
  }

  getScheduled() {
    return this.http.get<any[]>(`${this.api}/scheduled`);
  }

  getPublished() {
    return this.http.get<any[]>(`${this.api}/published`);
  }

  getPermanent() {
    return this.http.get<any[]>(`${this.api}/permanent`);
  }

  // ================= CAMPAIGN (NEW) =================

  // 🔥 Needed for Campaign Details page
  getByCampaign(campaignId: number) {
    return this.http.get<any[]>(`http://localhost:8081/campaigns/${campaignId}/posts`);
  }

  // ================= POST ACTIONS =================

  publishPost(postId: number) {
    return this.http.post(`http://localhost:8081/publish/${postId}`, {});
  }

  getById(id: number) {
    return this.http.get<any>(`${this.api}/${id}`);
  }

  updatePost(id: number, data: any) {
    return this.http.put(`${this.api}/${id}`, data, {
      responseType: 'text'
    });
  }

  generateImage(id: number) {
    return this.http.post(`${this.api}/${id}/generate-image`, {});
  }
}