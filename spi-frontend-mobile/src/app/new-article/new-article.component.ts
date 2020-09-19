import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "@nativescript/angular";
import { SegmentedBarItem } from "@nativescript/core/ui/segmented-bar";
import { MenuService } from "../shared/menu.service";

@Component({
    selector: "NewArticle",
    templateUrl: "./new-article.component.html"
})
export class NewArticleComponent implements OnInit {

    constructor(
        private menuService: MenuService,
        private routerExt: RouterExtensions) {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        // Use the "ngOnInit" handler to initialize data for the view.
    }

    get menuItems(): Array<SegmentedBarItem> {
        return this.menuService.getMenuItems();
    }

    onSelectedMenuChange(index: number): void {
        if (!isNaN(index) && index != 1) {
            const route = this.menuService.getItemRoute(index);
            this.routerExt.navigate([`../${route}`]);
        } 
    }
}
