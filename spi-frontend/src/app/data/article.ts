
export class Article {
    
    id: number;
    name: string;
    price: number;

    constructor() {  
    }

    // TODO: delete
    initDummyData(): void {
        this.name = 'cappucino';
        this.price = 150;
    }
}