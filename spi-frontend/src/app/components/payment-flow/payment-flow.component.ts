import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/data/article';
import { PaymentSplit } from 'src/app/data/payment-split';
import { MatSnackBar, MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from 'src/app/services/article.service';
import { PaymentSplitService } from 'src/app/services/payment-split.service';
import { AccountObservableService } from 'src/app/services/account-observable.service';
import { ConfigureSplitDialogComponent } from '../configure-split-dialog/configure-split-dialog.component';
import { SplitDialogData } from 'src/app/data/split-dialog-data';

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
  paymentSplits: Array<PaymentSplit>;

  dialogRef: MatDialogRef<ConfigureSplitDialogComponent>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private articleService: ArticleService,
    private paymentSplitService: PaymentSplitService,
    private accObservService: AccountObservableService,
    private dialog: MatDialog
    ) {
  }

  ngOnInit() {
    this.paymentSplits = [];
    this.article = new Article();
    
    this.route.params.subscribe(
      params => {
        this.getArticle(params['id']);
      }
    );
  }

  getArticle(articleId: number) {
    this.articleService.getArticleById(articleId).subscribe(
      data => {
        this.article = data;
        this.insertRemainderIntoChart();
        this.article.paymentSplits.forEach(split => {
          this.insertSplitInChart(split);
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

    if(!this.isSplitAdded($paySplit.account.number)) {
      this.createPaymentSplit($paySplit);
      setTimeout(() => {
        window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" });
      }, 100)
    } else {
      this.snackBar.open(`Account with number ${$paySplit.account.number} has already been added`);
    }
    
  }

  createPaymentSplit(paySplit: PaymentSplit) {
    
    paySplit.articleId = this.article.id;
    this.paymentSplitService.createPaymentSplit(paySplit).subscribe(
      data => {
        this.insertSplitInChart(data);
        this.accObservService.sendAccount(data.account);
      },
      err => {
        this.snackBar.open(err.error.message);
      }
    );
  }

  updatePaymentSplit(dialogData: SplitDialogData) {

    const currentSplit = this.paymentSplits[dialogData.paySplitIndex];
    if(this.pieChartData[0] + currentSplit.amount - dialogData.paymentSplit.amount < 0) {
      this.snackBar.open('Insufficient funds');
      return;
    }

    this.paymentSplitService.updatePaymentSplit(dialogData.paymentSplit).subscribe(
      data => {
        this.accObservService.sendAccount(data);
        this.updateSplitInChart(data, dialogData.paySplitIndex);
        this.dialogRef.close();
      },
      err => {
        this.snackBar.open(err.error.message);
      }
    );
  }

  removePaymentSplit(dialogData: SplitDialogData) {

    this.paymentSplitService.removePaymentSplit(dialogData.paymentSplit.id).subscribe(
      data => {
        this.removeSplitFromChart(dialogData.paymentSplit, dialogData.paySplitIndex);
      },
      err => {
        this.snackBar.open(err.error.message);
      }
    );

  }

  removeSplitFromChart(split: PaymentSplit, splitIndex: number) {
    this.pieChartData[0] += split.amount; // add the amount to the remainder

    this.paymentSplits.splice(splitIndex, 1);
    this.pieChartLabels.splice(splitIndex + 1, 1); // adding +1 to skip the label indicating the remaining amount
    this.pieChartData.splice(splitIndex + 1, 1);
  }

  updateSplitInChart(split: PaymentSplit, splitIndex: number): void {
    this.pieChartData[0] += this.paymentSplits[splitIndex].amount; // add old amount to the remainder price
    this.pieChartData[0] -= split.amount; // decrease new amount from the remainder price

    this.paymentSplits[splitIndex] = split;
    this.pieChartLabels[splitIndex + 1] = split.account.recipientName; // adding +1 to skip the label indicating the remaining amount
    this.pieChartData[splitIndex + 1] = split.amount;
  }

  insertSplitInChart(split: PaymentSplit): void {
      this.pieChartData[0] -= split.amount;
      this.paymentSplits.push(split);
      this.pieChartLabels.push(split.account.recipientName);
      this.pieChartData.push(split.amount);
      this.labelColors[0].backgroundColor.push(this.generateRandomColor());
  }

  isSplitAdded(accountNum: string): boolean {
    var isAdded = false;
    this.paymentSplits.forEach( split => {
      if (split.account.number === accountNum) {
        isAdded = true;
      }
    });
    return isAdded;
  }

  generateRandomColor(): string {
    return `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)},
      ${Math.floor(Math.random() * 256)}, 1)`;
  }

  chartClicked(event: any) {
    if (event.active.length > 0) {
      const chart = event.active[0]._chart;
      const activePoints = chart.getElementAtEvent(event.event);
      if (activePoints.length > 0) {
        const clickedElementIndex = activePoints[0]._index;
        if (clickedElementIndex > 0) {
          this.openDialog(clickedElementIndex-1); // remaining amount is at index 0, so I add -1
        }
      }
    }
  }

  openDialog(paySplitIndex: number): void {

    // prep data to transfer to dialog
    const splitDialogData = new SplitDialogData();
    splitDialogData.article = this.article;
    splitDialogData.paymentSplit = new PaymentSplit();
    splitDialogData.paymentSplit.updateValues(this.paymentSplits[paySplitIndex]);
    splitDialogData.paySplitIndex = paySplitIndex;

    this.dialogRef = this.dialog.open(ConfigureSplitDialogComponent, {
      data: {
        dialogData: splitDialogData
      }
    });

    const dialogEditSubscr = this.dialogRef.componentInstance.updateClicked.subscribe(
      result => {
        this.updatePaymentSplit(result);
        dialogEditSubscr.unsubscribe();
      }
    );

    const dialogRemoveSubscr = this.dialogRef.componentInstance.removeClicked.subscribe(
      result => {
        this.removePaymentSplit(result);
        dialogRemoveSubscr.unsubscribe();
      }
    );
  }

}
