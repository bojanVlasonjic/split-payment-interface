import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentFlowComponent } from './components/payment-flow/payment-flow.component';
import { ManageArticleComponent } from './components/manage-article/manage-article.component';
import { ViewArticlesComponent } from './components/view-articles/view-articles.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'payment-flow/-1',
    pathMatch: 'full'
  },
  {
    path: 'payment-flow/:id',
    component: PaymentFlowComponent
  },
  {
    path: 'manage-article',
    component: ManageArticleComponent
  },
  {
    path: 'my-articles',
    component: ViewArticlesComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
