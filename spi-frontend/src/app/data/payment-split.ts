import { Account } from './account';

export class PaymentSplit {

    // dto data
    id: number;
    articleId: number;
    amount: number;
    account: Account;

    // additional data
    splitIndex: number;
    color: string;

    constructor() {
        this.account = new Account();
        this.amount = 0;
        this.splitIndex = -1;
    }

    updateValues(paySplit: PaymentSplit) {
        this.id = paySplit.id;
        this.articleId = paySplit.articleId;
        this.amount = paySplit.amount;

        this.account.updateValues(paySplit.account);
    }
}