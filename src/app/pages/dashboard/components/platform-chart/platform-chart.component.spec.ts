import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformChartComponent } from './platform-chart.component';

describe('PlatformChartComponent', () => {
  let component: PlatformChartComponent;
  let fixture: ComponentFixture<PlatformChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlatformChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
