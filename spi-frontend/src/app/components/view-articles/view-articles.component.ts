import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/services/article.service';
import { Article } from 'src/app/data/article';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

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
    private activatedRoute: ActivatedRoute,
    private articleService: ArticleService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
    this.getUserArticles();
  }

  getUserArticles(): void {
    this.requestFinished = false;
    this.searchArticles('', 0);
  }

  displayError(err: any): void {
    if (err.error.message != null) {
      this.snackBar.open(err.error.message);
    } else {
      this.snackBar.open(err.message);
    }
  }

  searchArticles(name: string, pageNum: number): void {

    this.articleService.searchArticles(name, this.pageNum).subscribe(
      data => {
        this.userArticles = data;
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

  performSearch($event): void {
    this.searchArticles($event.target.value, 0);
  }

  configurePaymentFlow(article: Article) {
    this.router.navigate(['payment-flow']);
    this.router.navigate([`payment-flow/${article.id}`], {relativeTo: this.activatedRoute});
  }

}
