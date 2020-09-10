import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { PaymentSplit } from 'src/app/data/payment-split';
import { AccountService } from 'src/app/services/account.service';
import { Account } from 'src/app/data/account';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Article } from 'src/app/data/article';
import { FormControl, Validators } from '@angular/forms';
import { AccountObservableService } from 'src/app/services/account-observable.service';

@Component({
  selector: 'app-manage-split',
  templateUrl: './manage-split.component.html',
  styleUrls: ['./manage-split.component.css']
})
export class ManageSplitComponent implements OnInit, OnDestroy {

  //paymentSplit: PaymentSplit = new PaymentSplit();
  accountNumControl: FormControl = new FormControl('', [Validators.required]);
  splitType: string = '';
  investmentPercentage: number = 0;

  userAccounts: Array<Account> = [];
  filteredAccounts: Observable<Account[]> = new Observable<Account[]>();

  isUpdating: boolean;
  accObservSubscription: Subscription;

  @Output() createSplitEvent = new EventEmitter<PaymentSplit>();
  @Output() updateSplitEvent = new EventEmitter<PaymentSplit>();
  @Input() article: Article;
  @Input() paymentSplit: PaymentSplit;

  constructor(
    private accountService: AccountService,
    private accObservService: AccountObservableService
    ) { }

  ngOnInit() {
    this.getUserAccounts();
    this.initAutocompleteFilter();

    if(this.paymentSplit == null) {
      this.paymentSplit = new PaymentSplit();
      this.isUpdating = false;
    } else {
      this.accountNumControl.setValue(this.paymentSplit.account.number);
      this.isUpdating = true;
      this.accountNumControl.disable();
    }
    
    // update user accounts
    this.accObservSubscription = this.accObservService.getAccount().subscribe(
      data => {
        const accIndex = this.getAccountIndexByNumber(data.number); 
        if (accIndex == -1) {
          this.userAccounts.push(data);
        } else {
          this.userAccounts[accIndex] = data;
        }
      }
    );
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

  createPaymentSplit(): void {
    if(this.paymentSplit.amount != null && this.paymentSplit.amount > 0) {
      this.paymentSplit.account.number = this.accountNumControl.value;
      const accIndex = this.getAccountIndexByNumber(this.accountNumControl.value);
      if(accIndex == -1) {
        this.paymentSplit.account.id = null; // the account hasn't been created yet
      }
      this.createSplitEvent.emit(this.paymentSplit);
    }
  }

  updatePaymentSplit(): void {
    if(this.paymentSplit.amount != null && this.paymentSplit.amount > 0) {
      this.paymentSplit.account.number = this.accountNumControl.value;
      this.updateSplitEvent.emit(this.paymentSplit);
    }
  }

  splitTypeChange(value: string) {
    this.splitType = value;
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
      this.paymentSplit.account.updateValues(this.userAccounts[accIndex]);
    }
  }

  getAccountIndexByNumber(accNum: string): number {
    for (let i = 0; i < this.userAccounts.length; i++) {
      if (this.userAccounts[i].number == accNum) {
        return i;
      }
    }
    return -1;
  }

  ngOnDestroy() {
    this.accObservSubscription.unsubscribe();
  }

}
