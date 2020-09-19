import { Component, OnInit } from "@angular/core";
import { MenuService } from "../shared/menu.service";
import { RouterExtensions } from "@nativescript/angular";
import { SegmentedBarItem } from "@nativescript/core/ui/segmented-bar";

@Component({
    selector: "MyArticles",
    templateUrl: "./my-articles.component.html"
})
export class MyArticlesComponent implements OnInit {

    constructor(
        private menuService: MenuService,
        private routerExt: RouterExtensions) {
        // Use the constructor to inject services.
    }

    ngOnInit(): void {
        // Use the "ngOnInit" handler to initialize data for the view.
    }

    get menuItems(): Array<SegmentedBarItem> {
        return this.menuService.getMenuItems();
    }

    onSelectedMenuChange(index: number): void {
        if (!isNaN(index) && index != 2) {
            const route = this.menuService.getItemRoute(index);
            this.routerExt.navigate([`../${route}`]);
        } 
    }
}
