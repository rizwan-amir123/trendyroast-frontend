import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrendService {

  constructor(private http: HttpClient) { }

  getTrends(country: string = 'us'): Observable<any> {
    const apiKey = environment.NEWSAPI_KEY;
  	const url = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${apiKey}`;

    return this.http.get(url).pipe(
      map((data: any) => {
        if (data.status !== 'ok') {
          throw new Error('Failed to fetch trends');
        }

        const trends = data.articles?.slice(0, 6).map((article: any) => ({
          title: article.title,
          source: article.source?.name || 'Unknown',
          url: article.url
        })) || [];

        return { trends };
      })
    );
  }
}
