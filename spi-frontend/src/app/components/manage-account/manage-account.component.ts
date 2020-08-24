import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { PaymentSplit } from 'src/app/data/payment-split';
import { AccountService } from 'src/app/services/account.service';
import { Account } from 'src/app/data/account';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.css']
})
export class ManageAccountComponent implements OnInit {

  paymentSplit: PaymentSplit = new PaymentSplit();
  splitType: string = '';

  investmentPercentage: number = 0;
  userAccounts: Array<Account> = [];
  filteredAccounts: Observable<Account[]> = new Observable<Account[]>();

  @Output() paySplitEvent = new EventEmitter<PaymentSplit>();
  @Input() articlePrice: number;

  constructor(
    private accountService: AccountService
    ) { }

  ngOnInit() {
    this.getUserAccounts();
  }

  getUserAccounts(): void {
    this.accountService.getUserAccounts(-1).subscribe(
      data => {
        this.userAccounts = data;
      },
      err => {
        console.log(err.error);
      }
    );
  }

  createAccount(): void {
    // TODO: validate call service method
    this.paySplitEvent.emit(this.paymentSplit);
  }

  fixedSplitChange($event: any) {
    this.splitType = 'fixed';
  }

  percentualSplitChange($event: any) {
    this.splitType = 'percentual';
  }

  onFixedValueChange($event: any) {
    this.paymentSplit.amount = $event.value;
  }

  onPercentualValueChange($event: any) {
    this.paymentSplit.amount = Math.round(($event.value/100) * this.articlePrice);
    this.investmentPercentage = $event.value;
  }

  onPercentualInputChange($event: any) {
    this.paymentSplit.amount = Math.round(($event.target.value/100) * this.articlePrice);
  }


  filterAccounts(): void {
    this.filteredAccounts = of(this.userAccounts).pipe(map(accounts => this.filter(accounts)));
  }

  filter(accounts: any): Array<any> {
    return accounts.filter(acc => acc.number.includes(this.paymentSplit.account.number));
  }

  accountSelected(event: any) {
    this.paymentSplit.account = event.option.value;
  }


}
