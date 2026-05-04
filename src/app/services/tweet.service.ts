import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TweetService {

  generateTweet(trends: any[]): Observable<any> {
    const trendText = trends.map(t => `- ${t.title}`).join('\n');

    const prompt = `You are a savage and witty Twitter comedian. 
Write ONE extremely funny roast tweet (max 280 characters) based on these current trends:

${trendText}

Make it viral, use emojis, and hashtags if funny. Return only the tweet.`;

    return new Observable(observer => {
      fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
				headers: {
					'Authorization': `Bearer ${environment.GROQ_API_KEY }`,
					'Content-Type': 'application/json'
				},
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.85,
          max_tokens: 200
        })
      })
      .then(res => res.json())
      .then(data => {
        const tweet = data.choices?.[0]?.message?.content?.trim() || "Couldn't generate tweet";
        observer.next({ tweet });
        observer.complete();
      })
      .catch(err => observer.error(err));
    });
  }
}
