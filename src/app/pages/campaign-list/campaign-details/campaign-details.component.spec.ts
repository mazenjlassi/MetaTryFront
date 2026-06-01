import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CampaignDetailsComponent } from './campaign-details.component';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from '../../../services/campaign.service';
import { PostService } from '../../../services/post.service';
import { InsightService } from '../../../services/insight.service';
import { CommentService } from '../../../services/comment.service';
import { ConfirmDialogService } from '../../../shared/confirm-dialog/confirm-dialog.service';
import { of } from 'rxjs';

describe('CampaignDetailsComponent', () => {
  let component: CampaignDetailsComponent;
  let fixture: ComponentFixture<CampaignDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaignDetailsComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '1' } } } },
        { provide: CampaignService, useValue: { getById: () => of({}), getCampaignPosts: () => of([]) } },
        { provide: PostService, useValue: { getByCampaign: () => of([]) } },
        { provide: InsightService, useValue: { getByCampaign: () => of({}) } },
        { provide: CommentService, useValue: { getByCampaign: () => of([]) } },
        { provide: ConfirmDialogService, useValue: { confirm: () => of(true) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CampaignDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
