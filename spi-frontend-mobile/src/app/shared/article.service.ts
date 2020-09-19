import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../dto/article';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) { }

  searchArticles(name: string, pageNum: number): Observable<any> {
    return this.http.get(`api/article?name=${name}&pageNum=${pageNum}`);
  }

  getArticleById(articleId: number): Observable<any> {
    return this.http.get(`api/article/${articleId}`);
  }

  createArticle(article: Article): Observable<any> {
    return this.http.post(`api/article`, article);
  }

  updateArticle(article: Article): Observable<any> {
    return this.http.put('api/article', article);
  }

  deleteArticle(articleId: number): Observable<any> {
    return this.http.delete( `api/article/${articleId}`);
  }
}
