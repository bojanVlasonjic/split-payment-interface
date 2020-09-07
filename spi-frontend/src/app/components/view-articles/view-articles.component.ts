import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/services/article.service';
import { Article } from 'src/app/data/article';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-articles',
  templateUrl: './view-articles.component.html',
  styleUrls: ['./view-articles.component.css']
})
export class ViewArticlesComponent implements OnInit {

  pageNum: number = 0;
  userArticles: Array<Article> = [];
  requestFinished: boolean = true;

  constructor(
    private articleService: ArticleService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
    this.getUserArticles();
  }

  getUserArticles(): void {
    this.requestFinished = false;

    this.articleService.getUserArticles(-1, this.pageNum).subscribe(
      data => {
        this.userArticles = data;
        this.pageNum += 1; // to ensure I fetch new data the next time
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

  displayError(err: any): void {
    if (err.error.message != null) {
      this.snackBar.open(err.error.message);
    } else {
      this.snackBar.open(err.message);
    }
  }

  redirectToPaymentFlow(articleId: number) {
    this.router.navigate([`/payment-flow/${articleId}`]);
  }

}
