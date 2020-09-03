import { Article } from './article'
import { PaymentSplit } from './payment-split'

export class SplitDialogData {
    article: Article
    paymentSplit: PaymentSplit
    paySplitIndex: number

    constructor() {
        this.article = new Article();
        this.paymentSplit = new PaymentSplit();
        this.paySplitIndex = -1;
    }

    updateValues(article: Article, paymentSplit: PaymentSplit, index: number) {
        this.article = article;
        this.paymentSplit = paymentSplit;
        this.paySplitIndex = index;
    }
}