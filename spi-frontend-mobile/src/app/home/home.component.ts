import { Component, OnInit } from "@angular/core";

import { RouterExtensions } from "@nativescript/angular";
import { MenuService } from "../shared/menu.service";
import { SegmentedBarItem } from "@nativescript/core/ui/segmented-bar";

@Component({
    selector: "Home",
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {


    constructor(
        private menuService: MenuService,
        private routerExt: RouterExtensions) { 
        }

    ngOnInit(): void {
    }

    get menuItems(): Array<SegmentedBarItem> {
        return this.menuService.getMenuItems();
    }

    onSelectedMenuChange(index: number): void {
        if (!isNaN(index) && index != 0) {
            const route = this.menuService.getItemRoute(index);
            this.routerExt.navigate([`../${route}`]);
        } 
    }
}
