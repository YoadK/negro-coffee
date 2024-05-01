import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home-area/home/home.component';

import { Page404Component } from './components/SharedArea/page404/page404.component';
// import { DataListComponent } from './components/data-area/data-list/data-list.component';
// import { AddDataComponent } from './components/data-area/add-data/add-data.component';
// import { Page404Component } from './components/layout-area/page404/page404.component';


export const routes: Routes = [
   

    { path: 'home', component: HomeComponent },
    { path: 'data', component: HomeComponent },
    { path: 'web-development', component: HomeComponent },
    { path: 'design', component: HomeComponent },
    { path: 'it-services', component: HomeComponent },
    { path: 'contact', component: HomeComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: "**", component: Page404Component }

    // { path: "home", component: HomeComponent },
    // { path: "list", component: ProductListComponent },
    // { path: "new", component: AddProductComponent },
    // { path: "", redirectTo: "/home", pathMatch: "full" },
    // { path: "**", component: Page404Component },
];

