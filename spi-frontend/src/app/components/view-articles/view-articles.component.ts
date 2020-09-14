import { Component, OnInit, OnDestroy } from '@angular/core';
import { ArticleService } from 'src/app/services/article.service';
import { Article } from 'src/app/data/article';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ArticlePage } from 'src/app/data/article-page';
import { ArticleObservableService } from 'src/app/services/article-observable.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-articles',
  templateUrl: './view-articles.component.html',
  styleUrls: ['./view-articles.component.css']
})
export class ViewArticlesComponent implements OnInit, OnDestroy {

  currentPage: number = 0;
  articlePage: ArticlePage = new ArticlePage();
  requestFinished: boolean = true;

  searchValue: string = '';
  clickedArticleId: number = undefined;

  windowWidth: number;
  observSubscr: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private articleService: ArticleService,
    private articleObservService: ArticleObservableService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
    this.windowWidth = window.innerWidth;
    this.searchArticles();
    if (this.router.url.includes('payment-flow')) {
      this.highlightArticle();
    }

    this.observSubscr = this.articleObservService.getArticle().subscribe(
      data => {
        this.articlePage.articles.forEach(art => {
          if (art.id == data.id) {
            art = data;
            return;
          }
        });
      },
      err => {
        this.snackBar.open(err.error.message);
      }
    );

  }

  highlightArticle(): void {
    const idStart = this.router.url.lastIndexOf('/');
    const idStr = this.router.url.substr(idStart+1);
    this.clickedArticleId = +idStr;
  }

  displayError(err: any): void {
    if (err.error.message != null) {
      this.snackBar.open(err.error.message);
    } else {
      this.snackBar.open(err.message);
    }
  }

  searchArticles(): void {
    this.requestFinished = false;
    this.articleService.searchArticles(this.searchValue, this.currentPage).subscribe(
      data => {
        this.articlePage = data;
      },
      err => {
        this.displayError(err);
      }
    ).add(
      () => {
        this.requestFinished = true;
      }
    );
  }

  removeArticle(article: Article, index: number) {

    if(!window.confirm(`Are you sure you want to delete article \"${article.name}\"`)) {
      return;
    }

    this.articleService.deleteArticle(article.id).subscribe(
      data => {
        if(this.articlePage.articles.length == 1 && this.currentPage > 0) {
          this.currentPage--;
        }
        this.searchArticles();
        this.snackBar.open('Article successfully deleted');
        if (this.router.url.includes('payment-flow')) {
          this.router.navigate(['my-articles']);
        }
      },
      err => {
        this.snackBar.open(err.error.message);
      }
    )
  }

  performSearch(): void {
    this.currentPage = 0;
    this.searchArticles();
  }

  configurePaymentFlow(article: Article) {
    this.articleClicked(article.id);
    this.router.navigate([`payment-flow/${article.id}`], {relativeTo: this.activatedRoute});
  }

  editArticle(articleId: number) {
    this.articleClicked(articleId);
    this.router.navigate([`manage-article/${articleId}`], {relativeTo: this.activatedRoute});
  }

  articleClicked(id: number) {
    this.clickedArticleId = id;
  }
  
  nextPageClicked(): void {
    this.currentPage++;
    this.searchArticles();
  }

  previousPageClicked(): void {
    this.currentPage--;
    this.searchArticles();
  }

  ngOnDestroy() {
    this.observSubscr.unsubscribe();
  }

}
