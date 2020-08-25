import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { PaymentSplit } from 'src/app/data/payment-split';
import { AccountService } from 'src/app/services/account.service';
import { Account } from 'src/app/data/account';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Article } from 'src/app/data/article';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.css']
})
export class ManageAccountComponent implements OnInit {

  paymentSplit: PaymentSplit = new PaymentSplit();
  accountNumControl: FormControl = new FormControl();
  splitType: string = '';

  investmentPercentage: number = 0;
  userAccounts: Array<Account> = [];
  filteredAccounts: Observable<Account[]> = new Observable<Account[]>();

  @Output() paySplitEvent = new EventEmitter<PaymentSplit>();
  @Input() article: Article;

  constructor(
    private accountService: AccountService
    ) { }

  ngOnInit() {
    this.paymentSplit.articleId = this.article.id;
    this.getUserAccounts();
    this.initAutocompleteFilter();
  }

  initAutocompleteFilter(): void {
    this.filteredAccounts = this.accountNumControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
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
    this.paymentSplit.amount = Math.round(($event.value/100) * this.article.price);
    this.investmentPercentage = $event.value;
  }

  onPercentualInputChange($event: any) {
    this.paymentSplit.amount = Math.round(($event.target.value/100) * this.article.price);
  }


  private _filter(value: string): Account[] {
    return this.userAccounts.filter(acc => acc.number.includes(value));
  }

  accountSelected(event: any) {
    const accIndex = this.getAccountIndexByNumber(event.option.value);
    
    if(accIndex != -1) {
      this.paymentSplit.account = this.userAccounts[accIndex];
    }
  }

  getAccountIndexByNumber(accNum: string) {
    for (let i = 0; i < this.userAccounts.length; i++) {
      if (this.userAccounts[i].number === accNum) {
        return i;
      }
    }
    return -1;
  }


}
