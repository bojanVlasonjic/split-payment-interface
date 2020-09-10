
export class Account {
    
    id: number;
    userId: number;
    
    number: string;
    recipientName: string;
    recipientAddress: string;

    constructor() {

    }

    updateValues(acc: Account) {
        this.id = acc.id;
        this.userId = acc.userId;
        this.number = acc.number;
        this.recipientName = acc.recipientName;
        this.recipientAddress = acc.recipientAddress;
    }

}