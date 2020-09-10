import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ManageArticleComponent } from './components/manage-article/manage-article.component';
import { ViewArticlesComponent } from './components/view-articles/view-articles.component';
import { PaymentFlowComponent } from './components/payment-flow/payment-flow.component';
import { ChartsModule } from 'ng2-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS} from '@angular/material/snack-bar';
import { ConfigureSplitDialogComponent } from './components/configure-split-dialog/configure-split-dialog.component';
import {MatRadioModule} from '@angular/material/radio';
import { HomeComponent } from './components/home/home.component';
import { ManageSplitComponent } from './components/manage-split/manage-split.component';

@NgModule({
  declarations: [
    AppComponent,
    ManageArticleComponent,
    ViewArticlesComponent,
    PaymentFlowComponent,
    ConfigureSplitDialogComponent,
    HomeComponent,
    ManageSplitComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSnackBarModule,
    MatDialogModule,
    MatRadioModule
  ],
  providers: [
    {
    provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
    useValue: {duration: 2500}
    }
  ],
  entryComponents: [ConfigureSplitDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
