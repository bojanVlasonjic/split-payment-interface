import { Article } from './article';

export class ArticlePage {
    totalPages: number;
    pageNumber: number;
    articles: Array<Article>;

    constructor() {
        this.articles = [];
    }

}