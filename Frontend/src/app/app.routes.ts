import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home-area/home/home.component';

import { Page404Component } from './components/SharedArea/page404/page404.component';
import { AddProductComponent } from './components/products-area/add-product/add-product.component';
import { ProductListComponent } from './components/products-area/product-list/product-list.component';
import { LoginComponent } from './components/Auth-area/login/login.component';
import { RegisterComponent } from './components/Auth-area/register/register.component';
// import { DataListComponent } from './components/data-area/data-list/data-list.component';
// import { AddDataComponent } from './components/data-area/add-data/add-data.component';
// import { Page404Component } from './components/layout-area/page404/page404.component';


export const routes: Routes = [
   


    { path: "home", component: HomeComponent },
    { path: "shop", component: ProductListComponent },
    { path: "new", component: AddProductComponent },  
    { path: "login", component: LoginComponent },   
    { path: "register", component: RegisterComponent },   
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "**", component: Page404Component },
];

