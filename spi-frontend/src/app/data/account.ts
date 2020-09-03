
export class Account {
    
    id: number;
    userId: number;
    
    number: string;
    name: string;
    recipientName: string;
    recipientAddress: string;

    constructor() {

    }

    updateValues(acc: Account) {
        this.id = acc.id;
        this.userId = acc.userId;
        this.number = acc.number;
        this.name = acc.name;
        this.recipientName = acc.recipientName;
        this.recipientAddress = acc.recipientAddress;
    }

}