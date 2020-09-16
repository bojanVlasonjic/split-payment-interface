import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentFlowComponent } from './components/payment-flow/payment-flow.component';
import { ManageArticleComponent } from './components/manage-article/manage-article.component';
import { ViewArticlesComponent } from './components/view-articles/view-articles.component';
import { HomeComponent } from './components/home/home.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'manage-article',
    component: ManageArticleComponent
  },
  {
    path: 'my-articles',
    component: ViewArticlesComponent,
    children: [
      {
        path: 'payment-flow/:id',
        component: PaymentFlowComponent
      },
      {
        path: 'manage-article/:id',
        component: ManageArticleComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
