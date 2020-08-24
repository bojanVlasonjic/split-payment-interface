import { Account } from './account';

export class PaymentSplit {

    id: number;
    articleId: number;
    amount: number;
    account: Account;

    constructor() {
        this.account = new Account();
        this.amount = 0;
    }
}