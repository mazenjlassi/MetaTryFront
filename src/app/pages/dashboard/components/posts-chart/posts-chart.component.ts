import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../../../services/post.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-posts-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container">
      <canvas #chartCanvas></canvas>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      min-height: 200px;
    }
    .chart-container {
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class PostsChartComponent implements AfterViewInit, OnDestroy {

  @ViewChild('chartCanvas') chartRef!: ElementRef<HTMLCanvasElement>;
  chart: any;

  constructor(private postService: PostService) {}

  ngAfterViewInit() {
    setTimeout(() => this.loadChart(), 100);
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  loadChart() {
    if (!this.chartRef?.nativeElement) return;

    this.postService.getLatestPosts(10).subscribe(posts => {
      const fb = posts.filter(p => p.platform === 'FACEBOOK').reduce((sum, p) => sum + (p.likes || 0), 0);
      const ig = posts.filter(p => p.platform === 'INSTAGRAM').reduce((sum, p) => sum + (p.likes || 0), 0);
      const li = posts.filter(p => p.platform === 'LINKEDIN').reduce((sum, p) => sum + (p.likes || 0), 0);
      const total = fb + ig + li;
      this.createDonutChart(fb, ig, li, total);
    });
  }

  createDonutChart(fb: number, ig: number, li: number, total: number) {
    if (this.chart) {
      this.chart.destroy();
    }

    if (!this.chartRef?.nativeElement) return;

    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Facebook', 'Instagram', 'LinkedIn'],
        datasets: [{
          data: [fb || 1, ig || 1, li || 1],
          backgroundColor: [
            '#1877F2',
            '#E1306C',
            '#0A66C2'
          ],
          borderWidth: 0,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { 
              usePointStyle: true, 
              padding: 20, 
              font: { size: 11 },
              color: '#64748B'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 82, 214, 0.9)',
            titleFont: { size: 12, weight: 'bold' },
            bodyFont: { size: 11 },
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: (context: any) => {
                const value = context.raw as number;
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                return ` ${value} posts (${percentage}%)`;
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1000,
          easing: 'easeOutQuart'
        }
      },
      plugins: [{
        id: 'centerText',
        beforeDraw: (chart: any) => {
          const { ctx, width, height } = chart;
          ctx.restore();
          const fontSize = (height / 150).toFixed(2);
          ctx.font = `${fontSize}em sans-serif`;
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#0F52D6';
          const text = total.toString();
          const textWidth = ctx.measureText(text).width;
          ctx.fillText(text, width / 2 - textWidth / 2, height / 2);
          ctx.save();
        }
      }]
    });
  }
}