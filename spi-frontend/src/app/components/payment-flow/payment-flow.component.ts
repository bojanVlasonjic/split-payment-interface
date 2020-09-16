import { Component, OnInit, OnDestroy } from '@angular/core';
import { Article } from 'src/app/data/article';
import { PaymentSplit } from 'src/app/data/payment-split';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from 'src/app/services/article.service';
import { PaymentSplitService } from 'src/app/services/payment-split.service';
import { AccountObservableService } from 'src/app/services/account-observable.service';
import { SplitColor } from 'src/app/data/split-color';

@Component({
  selector: 'app-payment-flow',
  templateUrl: './payment-flow.component.html',
  styleUrls: ['./payment-flow.component.css']
})
export class PaymentFlowComponent implements OnInit {

  // chart data
  pieChartLabels: Array<string> = [];
  pieChartData: Array<number> = [];
  labelColors: Array<any> = [{backgroundColor: []}];
  pieChartType: string = 'pie';
  chartOptions: any = { maintainAspectRatio: false, responsive: true };

  article: Article;
  selectedSplit: PaymentSplit = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private articleService: ArticleService,
    private paymentSplitService: PaymentSplitService,
    private accObservService: AccountObservableService
    ) {
  }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.getArticle(params['id']);
        console.log(this.labelColors[0].backgroundColor);
      }
    );
  }

  resetChart(): void {
    this.pieChartData = [];
    this.pieChartLabels = [];
    this.labelColors = [{backgroundColor: []}];
  }

  getArticle(articleId: number) {
    this.accObservService.resetForm();
    this.selectedSplit = null;

    this.articleService.getArticleById(articleId).subscribe(
      data => {
        this.article = data;
        this.resetChart();
        this.insertRemainderIntoChart();
        this.article.paymentSplits.forEach(split => {
          this.insertSplitInChart(split, false);
        });
      },
      err => {
        this.displayError(err);
        this.router.navigate(['/home']);
      }
    );
  }

  insertRemainderIntoChart(): void {
    this.pieChartLabels.push('My share');
    this.pieChartData.push(this.article.price);
    this.labelColors[0].backgroundColor.push('rgb(76, 138, 76, 1)');
  }

  addNewSplit($paySplit: PaymentSplit): void {

    if(this.pieChartData[0] - $paySplit.amount < 0) {
      this.snackBar.open('Insufficient funds');
      return;
    }

    if(!this.isAccountAdded($paySplit.account.number)) {
      this.createPaymentSplit($paySplit);
    } else {
      this.snackBar.open(`Account with number ${$paySplit.account.number} has already been added`);
    }
    
  }

  createPaymentSplit(paySplit: PaymentSplit) {
    
    paySplit.articleId = this.article.id;
    this.paymentSplitService.createPaymentSplit(paySplit).subscribe(
      data => {
        data.splitColor = paySplit.splitColor; 
        this.insertSplitInChart(data, true);
        this.accObservService.sendAccount(data.account);
      },
      err => {
        this.displayError(err);
      }
    );
  }

  insertSplitInChart(split: PaymentSplit, isNew: boolean): void {
    this.pieChartData[0] -= split.amount;
    this.pieChartLabels.push(split.account.recipientName);
    this.pieChartData.push(split.amount);

    let colorsToDisplay : SplitColor;
    if(isNew) { // the article has just been created
      this.article.paymentSplits.push(split);
      colorsToDisplay = split.splitColor;
    } else { // the article exists and is being loaded
      colorsToDisplay = this.generateSplitColors();
      split.splitColor = colorsToDisplay;
    }

    this.labelColors[0].backgroundColor.push(colorsToDisplay.backgroundColor);

}

  updatePaymentSplit(paySplit: PaymentSplit) {

    const currentSplit = this.article.paymentSplits[paySplit.splitIndex];
    if(this.pieChartData[0] + currentSplit.amount - paySplit.amount < 0) {
      this.snackBar.open('Insufficient funds');
      return;
    }

    this.paymentSplitService.updatePaymentSplit(paySplit).subscribe(
      data => {
        this.updateSplitInChart(data, paySplit.splitIndex);
        this.snackBar.open('Payment split successfully updated');
      },
      err => {
        this.displayError(err);
      }
    );
  }

  updateSplitInChart(split: PaymentSplit, splitIndex: number): void {
    this.pieChartData[0] += this.article.paymentSplits[splitIndex].amount; // add old amount to the remainder price
    this.pieChartData[0] -= split.amount; // decrease new amount from the remainder price

    this.article.paymentSplits[splitIndex] = split;
    this.pieChartLabels[splitIndex + 1] = split.account.recipientName + ' '; // hack to ensure chart changes in runtime 
    this.pieChartData[splitIndex + 1] = split.amount; // adding +1 to skip the label indicating the remaining amount

    window.setTimeout(() => {
      this.pieChartLabels[splitIndex + 1] = split.account.recipientName; // hack to ensure chart changes in runtime 
    }, 200);
    
  }

  removePaymentSplit(paySplit: PaymentSplit) {

    this.paymentSplitService.removePaymentSplit(paySplit.id).subscribe(
      data => {
        this.removeSplitFromChart(paySplit, paySplit.splitIndex);
        this.selectedSplit = null;
      },
      err => {
        this.displayError(err);
      }
    );

  }

  removeSplitFromChart(split: PaymentSplit, splitIndex: number) {
    this.pieChartData[0] += split.amount; // add the amount to the remainder

    this.article.paymentSplits.splice(splitIndex, 1);
    this.pieChartLabels.splice(splitIndex + 1, 1); // adding +1 to skip the label indicating the remaining amount
    this.pieChartData.splice(splitIndex + 1, 1);
    this.labelColors[0].backgroundColor.splice(splitIndex + 1, 1);
  }

  isAccountAdded(accountNum: string): boolean {
    var isAdded = false;
    this.article.paymentSplits.forEach( split => {
      if (split.account.number === accountNum) {
        isAdded = true;
      }
    });
    return isAdded;
  }

  generateSplitColors(): SplitColor {

    let splitColor = new SplitColor();

    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);

    splitColor.backgroundColor = `rgba(${red}, ${green}, ${blue}, 1)`;

    // determine whether text color should be black or white
    if ((red*0.299 + green*0.587 + blue*0.114) > 127) {
      splitColor.textColor = 'black';
    } else{
      splitColor.textColor = 'white';
    }

    return splitColor;

  }

  chartClicked(event: any) {
    if (event.active.length > 0) {
      const chart = event.active[0]._chart;
      const activePoints = chart.getElementAtEvent(event.event);
      if (activePoints.length > 0) {
        const clickedElementIndex = activePoints[0]._index;
        if (clickedElementIndex > 0) {
          let paySplit = new PaymentSplit();
          paySplit.splitIndex =  clickedElementIndex - 1; // remaining amount is at index 0, so I add -1
          paySplit.updateValues(this.article.paymentSplits[clickedElementIndex-1]); // edit split option
          this.selectedSplit = paySplit;
        } else {
          this.selectedSplit = null; // add new split option
        }
      }
    }
  }

  displayError(err: any): void {
    if (err.error.message != null && err.error.message != '') {
      this.snackBar.open(err.error.message);
    } else {
      this.snackBar.open(err.message);
    }
  }

}