import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/services/article.service';
import { Article } from 'src/app/data/article';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ArticlePage } from 'src/app/data/article-page';

@Component({
  selector: 'app-view-articles',
  templateUrl: './view-articles.component.html',
  styleUrls: ['./view-articles.component.css']
})
export class ViewArticlesComponent implements OnInit {

  currentPage: number = 0;
  articlePage: ArticlePage = new ArticlePage();
  requestFinished: boolean = true;

  searchValue: string = '';
  clickedArticleId: number = undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private articleService: ArticleService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
    this.searchArticles();
    if (this.router.url.includes('payment-flow')) {
      this.highlightArticle();
    }
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

  performSearch(): void {
    this.currentPage = 0;
    this.searchArticles();
  }

  configurePaymentFlow(article: Article) {
    this.clickedArticleId = article.id;
    this.router.navigate([`payment-flow/${article.id}`], {relativeTo: this.activatedRoute});
  }
  
  nextPageClicked(): void {
    this.currentPage++;
    this.searchArticles();
  }

  previousPageClicked(): void {
    this.currentPage--;
    this.searchArticles();
  }

}
