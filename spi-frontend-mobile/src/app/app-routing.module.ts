import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule, NSEmptyOutletComponent } from "@nativescript/angular";
import { HomeComponent } from "./home/home.component";
import { NewArticleComponent } from "./new-article/new-article.component";
import { MyArticlesComponent } from "./my-articles/my-articles.component";

const routes: Routes = [
    {
        path: "",
        redirectTo: "/home",
        pathMatch: "full"
    },

    {
        path: "home",
        component: HomeComponent
    },
    {
        path: "new-article",
        component: NewArticleComponent
    },
    {
        path: "my-articles",
        component: MyArticlesComponent
    }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
