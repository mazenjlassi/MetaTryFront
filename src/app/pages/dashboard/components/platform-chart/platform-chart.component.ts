import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../../../services/post.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-platform-chart',
  standalone: true,
  imports: [CommonModule],
  template: `<canvas #chartCanvas></canvas>`
})
export class PlatformChartComponent implements AfterViewInit {

  @ViewChild('chartCanvas') chartRef!: ElementRef;
  chart: any;

  constructor(private postService: PostService) {}

  ngAfterViewInit() {
    this.loadData();
  }

  loadData() {
  this.postService.getPostStats().subscribe(stats => {

    console.log(stats); // 👈 keep this for debug

    const data = [
      stats.facebookPosts,
      stats.instagramPosts,
      stats.linkedinPosts
    ];

    this.createChart(data);
  });
}

  createChart(data: number[]) {

    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Facebook', 'Instagram', 'LinkedIn'],
        datasets: [
          {
            label: 'Published Posts',
            data: data,
            backgroundColor: [
              '#1877F2', // Facebook
              '#E1306C', // Instagram
              '#0A66C2'  // LinkedIn
            ],
            borderRadius: 8
          }
        ]
      },
      options: {
        indexAxis: 'y', 
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
          legend: {
            display: false
          }
        },

        scales: {
          x: {
            ticks: { color: '#ccc' },
            grid: { color: '#ffffff' }
          },
          y: {
            ticks: { color: '#ccc' },
            grid: { display: false }
          }
        }
      }
    });
  }
}