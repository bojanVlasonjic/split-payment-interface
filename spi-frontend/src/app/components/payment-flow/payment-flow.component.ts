import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-flow',
  templateUrl: './payment-flow.component.html',
  styleUrls: ['./payment-flow.component.css']
})
export class PaymentFlowComponent implements OnInit {

  pieChartLabels: Array<string> = [];
  pieChartData: Array<number> = [];
  labelColors: Array<any> = [{backgroundColor: []}];
  pieChartType: string = 'pie';

  constructor() { }

  ngOnInit() {
  }

  addShit(): void {
    this.pieChartLabels.push('Random shit ' + Math.round(Math.random() * 100));
    this.pieChartData.push(Math.round(Math.random() * 20));
    this.labelColors[0].backgroundColor.push(this.generateRandomColor());
  }

  removeShit(): void {
    this.pieChartLabels.splice(0, 1);
    this.pieChartData.splice(0, 1);
    this.labelColors[0].backgroundColor.splice(0, 1);
  }

  generateRandomColor(): string {
    return `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)},
      ${Math.floor(Math.random() * 256)}, 1)`;
  }

}
