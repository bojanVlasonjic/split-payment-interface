import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Account } from 'src/app/data/account';

@Component({
  selector: 'app-select-account',
  templateUrl: './select-account.component.html',
  styleUrls: ['./select-account.component.css']
})
export class SelectAccountComponent implements OnInit {

  accounts: FormControl;
  accountList: Array<Account>;

  constructor() { }

  ngOnInit() {
    this.accounts = new FormControl();
    this.accountList = [];
  }

}
