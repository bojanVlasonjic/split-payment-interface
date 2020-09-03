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

    updateValues(paySplit: PaymentSplit) {
        this.id = paySplit.id;
        this.articleId = paySplit.articleId;
        this.amount = paySplit.amount;

        this.account.updateValues(paySplit.account);
    }
}