import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TrendService } from './services/trend.service';
import { TweetService } from './services/tweet.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements OnInit {
  trends: any[] = [];
  generatedTweet: string = '';
  loading = false;
  selectedTrend: any = null;

  constructor(
    private trendService: TrendService,
    private tweetService: TweetService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadTrends();
  }

  loadTrends() {
    this.loading = false;
    this.generatedTweet = '';
    this.selectedTrend = null;
    
    this.trendService.getTrends().subscribe({
      next: (res) => {
        this.trends = res.trends || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to load trends. Make sure Django backend is running!');
        this.cdr.detectChanges();
      }
    });
  }

  generateTweet(trend: any) {
    this.selectedTrend = trend;
    this.loading = true;
    this.generatedTweet = '';

    this.tweetService.generateTweet([trend]).subscribe({
      next: (res: any) => {
        // Safely extract the tweet based on the response format
        if (res && res.tweet) {
          this.generatedTweet = res.tweet;
        } else if (typeof res === 'string') {
          this.generatedTweet = res;
        } else if (res && res.data) {
          this.generatedTweet = res.data;
        } else {
          // Fallback if the object format is unknown
          this.generatedTweet = JSON.stringify(res);
        }

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to generate tweet');
        this.loading = false;
        this.selectedTrend = null;
        this.cdr.detectChanges();
      }
    });
  }

  copyToClipboard() {
    if (this.generatedTweet) {
      navigator.clipboard.writeText(this.generatedTweet);
      alert('Tweet copied to clipboard!');
    }
  }

  goBack() {
    this.selectedTrend = null;
    this.generatedTweet = '';
    this.cdr.detectChanges();
  }
}
