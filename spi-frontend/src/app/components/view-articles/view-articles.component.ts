import { Component, OnInit, OnDestroy } from '@angular/core';
import { ArticleService } from 'src/app/services/article.service';
import { Article } from 'src/app/data/article';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ArticlePage } from 'src/app/data/article-page';
import { ArticleObservableService } from 'src/app/services/article-observable.service';
import { Subscription } from 'rxjs';
import { AppStateService } from 'src/app/services/app-state.service';

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

  observSubscr: Subscription;

  constructor(
    private appStateService: AppStateService,
    private activatedRoute: ActivatedRoute,
    private articleService: ArticleService,
    private articleObservService: ArticleObservableService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
    
    this.searchArticles();
    if (this.router.url.includes('payment-flow')) {
      this.highlightArticle();
    }

    this.observSubscr = this.articleObservService.getArticle().subscribe(
      data => {
        for (let i = 0; i < this.articlePage.articles.length; i++) {
          if (this.articlePage.articles[i].id == data.id) {
            this.articlePage.articles[i] = data;
            break;
          }
        }
      },
      err => {
        this.displayError(err);
      }
    );

  }

  isDekstopState(): boolean {
    return this.appStateService.isDesktopResolution();
  }

  highlightArticle(): void {
    const idStart = this.router.url.lastIndexOf('/');
    const idStr = this.router.url.substr(idStart+1);
    this.clickedArticleId = +idStr;
  }

  displayError(err: any): void {
    if (err.error.message != null && err.error.message != '') {
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
        this.displayError(err);
      }
    )
  }

  performSearch(): void {
    this.currentPage = 0;
    this.searchArticles();
  }

  configurePaymentFlow(article: Article) {
    // scroll to chart if needed
    this.appStateService.scrollIfNeccessary(this.appStateService.isSmallScreen(), 4);

    this.articleClicked(article.id);
    this.router.navigate([`payment-flow/${article.id}`], {relativeTo: this.activatedRoute});
  }

  editArticle(articleId: number) {
    // scroll to bottom if needed
    this.appStateService.scrollIfNeccessary(!this.appStateService.isDesktopResolution(), 1);
    
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
