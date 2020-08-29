import { Component, OnInit } from '@angular/core';
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
  paymentSplits: Array<PaymentSplit>;

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
          this.insertSplit(split);
        });
      },
      err => {
        this.snackBar.open(err.error.message);
        this.router.navigate(['/my-articles']);
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
        this.paymentSplits.push(data);
        this.insertSplit(data);
        this.accObservService.sendAccount(data.account);
      },
      err => {
        this.snackBar.open(err.error.message);
      }
    );
  }

  insertSplit(split: PaymentSplit): void {
      this.pieChartData[0] -= split.amount;
      this.paymentSplits.push(split);
      this.pieChartLabels.push(split.account.name);
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
        // get the internal index of slice in pie chart
        const clickedElementIndex = activePoints[0]._index;
        const label = chart.data.labels[clickedElementIndex];
        // get value by index
        const value = chart.data.datasets[0].data[clickedElementIndex];
        console.log(clickedElementIndex, label, value)
      }
    }
  }

}
