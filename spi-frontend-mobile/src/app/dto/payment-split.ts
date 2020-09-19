import { Account } from './account';
import { SplitColor } from './split-color';

export class PaymentSplit {

    // dto data
    id: number;
    articleId: number;
    amount: number;
    account: Account;

    // additional data
    splitIndex: number;
    splitColor: SplitColor;

    constructor() {
        this.account = new Account();
        this.splitColor = new SplitColor();
        this.amount = 0;
        this.splitIndex = -1;
    }

    updateValues(paySplit: PaymentSplit) {
        this.id = paySplit.id;
        this.articleId = paySplit.articleId;
        this.amount = paySplit.amount;

        this.splitColor.updateValues(paySplit.splitColor);
        this.account.updateValues(paySplit.account);
    }
}