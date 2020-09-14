import { Component, OnInit, EventEmitter, Output, Input, OnDestroy, ViewChild } from '@angular/core';
import { PaymentSplit } from 'src/app/data/payment-split';
import { AccountService } from 'src/app/services/account.service';
import { Account } from 'src/app/data/account';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Article } from 'src/app/data/article';
import { FormControl, Validators } from '@angular/forms';
import { AccountObservableService } from 'src/app/services/account-observable.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-manage-split',
  templateUrl: './manage-split.component.html',
  styleUrls: ['./manage-split.component.css']
})
export class ManageSplitComponent implements OnInit, OnDestroy {

  accountNumControl: FormControl = new FormControl('', [Validators.required]);
  splitType: string = '';
  investmentPercentage: number = 0;

  userAccounts: Array<Account> = [];
  filteredAccounts: Observable<Account[]> = new Observable<Account[]>();

  isUpdating: boolean;
  accObservSubscription: Subscription;

  @Output() createSplitEvent = new EventEmitter<PaymentSplit>();
  @Output() updateSplitEvent = new EventEmitter<PaymentSplit>();
  @Output() removeSplitEvent = new EventEmitter<PaymentSplit>();
  @Input() article: Article;
  paymentSplit: PaymentSplit;

  @ViewChild("splitForm", {static: false}) splitForm: any;

  constructor(
    private accountService: AccountService,
    private accObservService: AccountObservableService,
    private snackBar: MatSnackBar
    ) { }

  @Input() set setPaymentSplit(value: PaymentSplit) {

    if(value == null) {
      if(this.splitForm != null) {
        this.resetForm();
      } else {
        this.paymentSplit = new PaymentSplit();
      }
      this.isUpdating = false;
      this.accountNumControl.enable();
    } else {
      this.paymentSplit = value;
      this.accountNumControl.setValue(this.paymentSplit.account.number);
      this.isUpdating = true;
      this.accountNumControl.disable();
    }

  }

  ngOnInit() {
    this.getUserAccounts();
    this.initAutocompleteFilter();
    
    // update user accounts
    this.accObservSubscription = this.accObservService.getAccount().subscribe(
      data => {
        if (data != null) {
          const accIndex = this.getAccountIndexByNumber(data.number); 
          if (accIndex == -1) {
            this.userAccounts.push(data);
          } else {
            this.userAccounts[accIndex] = data;
          }
        } else {
          this.resetForm();
        }
        
      }
    );
  }

  resetForm(): void {
    this.accountNumControl.reset();
    this.accountNumControl.enable();
    this.splitForm.reset();
    this.splitForm.submitted = false;
    this.splitType = '';
    this.paymentSplit = new PaymentSplit();
 
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
        this.snackBar.open('Failed to find your added accounts. Please refresh the page and try again');
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

  removePaymentSplit(): void {
    if (window.confirm(`Are you sure you want to remove payment split to ${this.paymentSplit.account.recipientName}?`)) {
      this.removeSplitEvent.emit(this.paymentSplit);
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
