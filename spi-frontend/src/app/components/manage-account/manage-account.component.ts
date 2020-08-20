import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Account } from 'src/app/data/account';

@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.css']
})
export class ManageAccountComponent implements OnInit {

  account: Account;
  splitType: string;
  investmentPercentage: number;

  accNums: Array<number> = [123, 456, 789];

  @Output() accountEvent = new EventEmitter<Account>();
  @Input() articlePrice: number;



  constructor() { }

  ngOnInit() {
    this.account = new Account();
    this.splitType = '';
  }

  createAccount(): void {
    // TODO: validate call service method
    this.accountEvent.emit(this.account);
  }

  fixedSplitChange($event: any) {
    this.splitType = 'fixed';
  }

  percentualSplitChange($event: any) {
    this.splitType = 'percentual';
  }

  onFixedValueChange($event: any) {
    this.account.investment = $event.value;
  }

  onPercentualValueChange($event: any) {
    this.account.investment = Math.round(($event.value/100) * this.articlePrice);
  }

  onPercentualInputChange($event: any) {
    this.account.investment = Math.round(($event.target.value/100) * this.articlePrice);
  }


}
