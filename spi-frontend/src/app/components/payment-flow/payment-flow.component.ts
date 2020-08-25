import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/data/article';
import { PaymentSplit } from 'src/app/data/payment-split';

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
  addedAccountsNumbers: Array<string>;

  constructor() {
  }

  ngOnInit() {
    this.addedAccountsNumbers = [];
    this.article = new Article();
    this.article.initDummyData();

    this.pieChartLabels.push('Remaining amount');
    this.pieChartData.push(this.article.price);
    this.labelColors[0].backgroundColor.push('rgba(169, 169, 169, 1');
    // todo: fetch article
  }


  addNewSplit($paySplit: PaymentSplit): void {

    if(this.pieChartData[0] - $paySplit.amount < 0) {
      window.alert('Insufficient funds');
      return;
    }

    if(!this.isSplitAdded($paySplit.account.number)) {
      this.pieChartData[0] -= $paySplit.amount;
      this.addedAccountsNumbers.push($paySplit.account.number);
      this.pieChartLabels.push($paySplit.account.name);
      this.pieChartData.push($paySplit.amount);
      this.labelColors[0].backgroundColor.push(this.generateRandomColor());
      setTimeout(() => {
        window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" });
      }, 100)
    }
    
  }

  isSplitAdded(accountNum: string): boolean {
    var isAdded = false;
    this.addedAccountsNumbers.forEach( num => {
      if (num === accountNum) {
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
