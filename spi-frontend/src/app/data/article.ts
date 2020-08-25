import { PaymentSplit } from './payment-split';

export class Article {
    
    id: number;
    userId: number;
    name: string;
    price: number;

    paymentSplits: Array<PaymentSplit>;

    constructor() {  
        this.paymentSplits = [];
    }

}