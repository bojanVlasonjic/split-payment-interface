
export class Article {
    
    id: string;
    name: string;
    price: number;

    constructor() {  
    }

    // TODO: delete
    initDummyData(): void {
        this.id = 'capp123';
        this.name = 'cappucino';
        this.price = 150;
    }
}