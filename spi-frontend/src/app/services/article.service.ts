import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../data/article';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) { }


  getUserArticles(userId: number, pageNum: number): Observable<any> {
    return this.http.get(`api/article/${userId}/${pageNum}`);
  }

  getArticleById(articleId: number): Observable<any> {
    return this.http.get(`api/article/${articleId}`);
  }

  createArticle(article: Article, userId: number): Observable<any> {
    return this.http.post(`api/article/${userId}`, article);
  }
}
