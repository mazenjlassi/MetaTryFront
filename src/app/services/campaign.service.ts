import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  private apiUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) {}

  // ================= CAMPAIGNS =================

  createCampaign(data: any) {
    return this.http.post(`${this.apiUrl}/campaigns`, data);
  }

  getAll() {
    return this.http.get<any[]>(`${this.apiUrl}/campaigns`);
  }

  getById(id: number) {
    return this.http.get<any>(`${this.apiUrl}/campaigns/${id}`);
  }

  getCampaignPosts(id: number) {
    return this.http.get<any[]>(`${this.apiUrl}/campaigns/${id}/posts`);
  }

  getCampaignInsights(id: number) {
    return this.http.get<any>(`${this.apiUrl}/insights/campaign/${id}`);
  }

  // ================= AI GENERATION =================

  generateCampaign(data: any) {
    return this.http.post(`${this.apiUrl}/campaigns/generate`, data);
  }
}