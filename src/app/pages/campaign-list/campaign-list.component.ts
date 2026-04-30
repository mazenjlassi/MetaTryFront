import { Component, OnInit } from '@angular/core';
import { CampaignService } from '../../services/campaign.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-campaign-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.css']
})
export class CampaignListComponent implements OnInit {

  campaigns: any[] = [];
  loading = true;
  error = '';

  constructor(
    private campaignService: CampaignService,
    private router: Router // ✅ ADD THIS
  ) {}

  ngOnInit(): void {
    this.campaignService.getAll().subscribe({
      next: (res) => {
        this.campaigns = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load campaigns';
        this.loading = false;
      }
    });
  }

  openCampaign(event: Event, id: number) {
    event.stopPropagation(); // 🚫 prevent card click
    this.router.navigate(['/campaigns', id]);
  }
}