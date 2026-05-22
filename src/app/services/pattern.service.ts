import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PatternService {

  private patternsApi = 'http://localhost:8081/api/patterns';
  private scrapedApi = 'http://localhost:8081/api/scraped-posts';

  constructor(private http: HttpClient) {}

  // ================= SCRAPED POSTS =================

  getScrapedPosts(companyName?: string) {
    let url = this.scrapedApi;
    if (companyName) {
      url += `?companyName=${encodeURIComponent(companyName)}`;
    }
    return this.http.get<any[]>(url);
  }

  createScrapedPost(data: any) {
    return this.http.post<any>(this.scrapedApi, data);
  }

  deleteScrapedPost(id: number) {
    return this.http.delete(`${this.scrapedApi}/${id}`);
  }

  getScrapedCount(companyName?: string) {
    let url = `${this.scrapedApi}/count`;
    if (companyName) {
      url += `?companyName=${encodeURIComponent(companyName)}`;
    }
    return this.http.get<any>(url);
  }

  // ================= COMPANIES =================

  getCompanies() {
    return this.http.get<any[]>(`${this.scrapedApi}/companies`);
  }

  // ================= PATTERNS =================

  getAllPatterns(companyName?: string) {
    let url = this.patternsApi;
    if (companyName) {
      url += `?companyName=${encodeURIComponent(companyName)}`;
    }
    return this.http.get<any[]>(url);
  }

  getPatternByTopic(topic: string) {
    return this.http.get<any>(`${this.patternsApi}/${encodeURIComponent(topic)}`);
  }

  matchPatterns(topic: string) {
    return this.http.get<any[]>(`${this.patternsApi}/match?topic=${encodeURIComponent(topic)}`);
  }

  getPatternsByPerformance() {
    return this.http.get<any[]>(`${this.patternsApi}/performance`);
  }

  runBatchAnalysis(companyName: string) {
    return this.http.post(`${this.patternsApi}/analyze-batch?companyName=${encodeURIComponent(companyName)}`, {}, { responseType: 'text' });
  }

  deletePattern(id: number) {
    return this.http.delete(`http://localhost:8081/api/patterns/crud/${id}`);
  }
}
