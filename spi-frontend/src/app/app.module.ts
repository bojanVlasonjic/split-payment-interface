import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ManageArticleComponent } from './components/manage-article/manage-article.component';
import { ViewArticlesComponent } from './components/view-articles/view-articles.component';
import { PaymentFlowComponent } from './components/payment-flow/payment-flow.component';
import { ChartsModule } from 'ng2-charts';
import { ManageAccountComponent } from './components/manage-account/manage-account.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { SelectAccountComponent } from './components/select-account/select-account.component';

@NgModule({
  declarations: [
    AppComponent,
    ManageArticleComponent,
    ViewArticlesComponent,
    PaymentFlowComponent,
    ManageAccountComponent,
    SelectAccountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
