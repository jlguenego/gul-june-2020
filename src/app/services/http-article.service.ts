import { Injectable } from '@angular/core';
import { ArticleService } from './article.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Article } from '../interfaces/article';

@Injectable({
  providedIn: 'root',
})
export class HttpArticleService extends ArticleService {
  constructor(private http: HttpClient) {
    super();
    console.log('http service constructor');
    this.refresh();
  }

  refresh(): void {
    this.http.get<Article[]>('/ws/articles').subscribe({
      next: (articles) => {
        console.log('articles: ', articles);
        this.articles = articles;
        this.save();
      },
      error: (err) => {
        console.error('err: ', err);
      },
      complete: () => {
        console.log('complete');
      },
    });
    super.refresh();
  }

  add(article: Article): void {
    super.add(article);
    this.http
      .post<void>('/ws/articles', article)
      .subscribe({
        next: () => {
          this.refresh();
        },
        error: (err) => {
          console.error('err: ', err);
        },
        complete: () => {
          console.log('complete');
        },
      });
  }

  remove(selectedArticles: Article[]): void {
    super.remove(selectedArticles);
    const ids = selectedArticles.map((a) => a.id);
    console.log('ids: ', ids);
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: ids,
    };
    this.http.delete('/ws/articles', options).subscribe({
      next: () => {
        this.refresh();
      },
      error: (err) => {
        console.error('err: ', err);
      },
      complete: () => {
        console.log('complete');
      },
    });
  }
}
