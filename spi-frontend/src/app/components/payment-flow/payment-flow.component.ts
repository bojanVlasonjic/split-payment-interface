import { Component, OnInit, OnDestroy } from '@angular/core';
import { Article } from 'src/app/data/article';
import { PaymentSplit } from 'src/app/data/payment-split';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from 'src/app/services/article.service';
import { PaymentSplitService } from 'src/app/services/payment-split.service';
import { AccountObservableService } from 'src/app/services/account-observable.service';

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
        this.snackBar.open(err.error.message);
        this.router.navigate(['/home']);
      }
    );
  }

  insertRemainderIntoChart(): void {
    this.pieChartLabels.push('Remaining amount');
    this.pieChartData.push(this.article.price);
    this.labelColors[0].backgroundColor.push('rgba(169, 169, 169, 1');
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
        data.color = paySplit.color; 
        this.insertSplitInChart(data, true);
        this.accObservService.sendAccount(data.account);
      },
      err => {
        this.snackBar.open(err.error.message);
      }
    );
  }

  insertSplitInChart(split: PaymentSplit, isNew: boolean): void {
    this.pieChartData[0] -= split.amount;
    this.pieChartLabels.push(split.account.recipientName);
    this.pieChartData.push(split.amount);

    let colorToDisplay: string;
    if(isNew) { // the article has just been created
      this.article.paymentSplits.push(split);
      colorToDisplay = split.color;
    } else { // the article exists and is being loaded
      colorToDisplay = this.generateRandomColor();
      split.color = colorToDisplay;
    }

    this.labelColors[0].backgroundColor.push(colorToDisplay);

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
        this.snackBar.open(err.error.message);
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
        this.snackBar.open(err.error.message);
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

  generateRandomColor(): string {
    return `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`;
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
          paySplit.color = this.labelColors[0].backgroundColor[clickedElementIndex];
          this.selectedSplit = paySplit;
        } else {
          this.selectedSplit = null; // add new split option
        }
      }
    }
  }

}