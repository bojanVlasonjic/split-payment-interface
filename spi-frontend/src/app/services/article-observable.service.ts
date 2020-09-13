import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Article } from '../data/article';

@Injectable({
  providedIn: 'root'
})
export class ArticleObservableService {

  private articleSubject: Subject<Article>; 

  constructor() {
    this.articleSubject = new Subject<Article>();
  }

  sendArticle(article: Article): void {
    this.articleSubject.next(article);
  }

  getArticle(): Observable<any> {
    return this.articleSubject.asObservable();
  }
}
