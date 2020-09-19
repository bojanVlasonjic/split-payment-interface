import { Injectable } from "@angular/core";
import { SegmentedBarItem } from "@nativescript/core/ui/segmented-bar";

@Injectable({
    providedIn: "root"
})
export class MenuService {

    menuItems:  Array<SegmentedBarItem> = [];
    menuTitles: Array<string> = ['Home', 'New article', 'My articles'];
    itemRoutes: Array<string> = ['/home', '/new-article', '/my-articles'];

    constructor() {
        this.menuTitles.forEach(title => {
            const item = new SegmentedBarItem();
            item.title = title;
            this.menuItems.push(item);
        });
    }
   
    getMenuItems(): Array<SegmentedBarItem> {
        return this.menuItems;
    }

    getItemRoute(index: number): string {
        return this.itemRoutes[index];
    }
}
