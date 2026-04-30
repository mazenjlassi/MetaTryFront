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
  templateUrl: './platform-chart.component.html',
  styleUrls: ['./platform-chart.component.css']
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

      console.log(stats); // debug

      const data = [
        stats.facebookPosts,
        stats.instagramPosts,
        stats.linkedinPosts
      ];

      this.createChart(data);
    });
  }
createChart(data: number[]) {

  if (this.chart) {
    this.chart.destroy();
  }

  this.chart = new Chart(this.chartRef.nativeElement, {
    type: 'bar',
    data: {
      labels: ['Facebook', 'Instagram', 'LinkedIn'],
      datasets: [
        {
          label: 'Posts Published',
          data: data,
          backgroundColor: [
            '#1877F2',
            '#E1306C',
            '#0A66C2'
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
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              return `${context.raw} posts published`;
            }
          }
        }
      },

      scales: {
        x: {
          ticks: { color: '#ccc' },
          grid: { color: '#333' }
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