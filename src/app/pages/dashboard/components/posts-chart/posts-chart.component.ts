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
  selector: 'app-posts-chart',
  standalone: true,
  imports: [CommonModule],
  template: `<canvas #chartCanvas></canvas>`
})
export class PostsChartComponent implements AfterViewInit {

  @ViewChild('chartCanvas') chartRef!: ElementRef;
  chart: any;

  constructor(private postService: PostService) {}

  ngAfterViewInit() {
    this.loadChart();
  }

  loadChart() {
    this.postService.getLatestPosts(15).subscribe(posts => {

      console.log(posts); // 👈 debug

      const labels = posts.map(p =>
        (p.platform === 'FACEBOOK' ? 'FB' : 'IG') + ' #' + p.id
      );

      const facebookLikes = posts.map(p =>
        p.platform === 'FACEBOOK' ? p.likes : 0
      );

      const instagramLikes = posts.map(p =>
        p.platform === 'INSTAGRAM' ? p.likes : 0
      );

      this.createChart(labels, facebookLikes, instagramLikes);
    });
  }

  createChart(labels: string[], fb: number[], ig: number[]) {

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Facebook',
            data: fb,
            backgroundColor: '#1877F2'
          },
          {
            label: 'Instagram',
            data: ig,
            backgroundColor: '#E1306C'
          }
        ]
      }
    });
  }
}