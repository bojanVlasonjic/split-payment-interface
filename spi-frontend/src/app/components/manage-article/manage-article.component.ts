import { Component, OnInit, ViewChild } from '@angular/core';
import { Article } from 'src/app/data/article';
import { ArticleService } from 'src/app/services/article.service';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleObservableService } from 'src/app/services/article-observable.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-manage-article',
  templateUrl: './manage-article.component.html',
  styleUrls: ['./manage-article.component.css']
})
export class ManageArticleComponent implements OnInit {

  isEditing: boolean = false;
  article: Article = new Article();
  @ViewChild("articleForm", {static: false}) articleForm: any;

  constructor(
    private authService: AuthenticationService,
    private articleService: ArticleService,
    private articleObservService: ArticleObservableService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        if(params['id'] !== undefined) {
          this.getArticle(params['id']);
          this.isEditing = true;
        } else {
          this.isEditing = false;
          this.article.userId = this.authService.getAuthenticatedUser();
        }
      }
    );
  }

  createArticle(): void {
    this.articleService.createArticle(this.article).subscribe(
      data => {
        this.snackBar.open('Article successfully saved');
        this.articleForm.reset();
      },
      err => {
        this.displayError(err);
      }
    );
  }

  updateArticle(): void {
    this.articleService.updateArticle(this.article).subscribe(
      data => {
        this.snackBar.open('Article successfully updated');
        this.articleObservService.sendArticle(data);
      },
      err => {
        this.displayError(err);
      }
    );
  }

  getArticle(id: number): void {
    this.articleService.getArticleById(id).subscribe(
      data => {
        this.article = data;
      },
      err => {
        this.displayError(err);
        this.router.navigate(['home']);
      }
    );
  }


  displayError(err: any): void {
    if (err.error.message != null && err.error.message != '') {
      this.snackBar.open(err.error.message);
    } else {
      this.snackBar.open(err.message);
    }
  }

}
