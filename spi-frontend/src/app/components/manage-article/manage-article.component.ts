import { Component, OnInit, ViewChild } from '@angular/core';
import { Article } from 'src/app/data/article';
import { ArticleService } from 'src/app/services/article.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-manage-article',
  templateUrl: './manage-article.component.html',
  styleUrls: ['./manage-article.component.css']
})
export class ManageArticleComponent implements OnInit {

  article: Article = new Article();
  @ViewChild("articleForm", {static: false}) articleForm: any;

  constructor(
    private articleService: ArticleService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  createArticle(): void {
    this.articleService.createArticle(this.article, -1).subscribe(
      data => {
        this.snackBar.open('Article successfully saved');
        this.articleForm.reset();
      },
      err => {
        this.displayError(err);
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

}
