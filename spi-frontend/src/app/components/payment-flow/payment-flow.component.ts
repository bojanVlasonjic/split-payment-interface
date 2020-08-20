import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/data/article';
import { Account } from 'src/app/data/account';

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
  accounts: Array<Account>;

  constructor() {
  }

  ngOnInit() {
    this.accounts = [];
    this.article = new Article();
    this.article.initDummyData();

    this.pieChartLabels.push('Remaining amount');
    this.pieChartData.push(this.article.price);
    this.labelColors[0].backgroundColor.push('rgba(169, 169, 169, 1');
    // todo: fetch article
  }


  addNewAccount($account: Account): void {
    this.pieChartData[0] -= $account.investment;
    this.accounts.push($account);
    this.pieChartLabels.push($account.name);
    this.pieChartData.push($account.investment);
    this.labelColors[0].backgroundColor.push(this.generateRandomColor());
    setTimeout(() => {
      window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: "smooth" });
    }, 100)
    
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
