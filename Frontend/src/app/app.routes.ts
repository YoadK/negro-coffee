import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home-area/home/home.component';
import { Page404Component } from './components/SharedArea/page404/page404.component';
import { AddProductComponent } from './components/products-area/add-product/add-product.component';
import { LoginComponent } from './components/Auth-area/login/login.component';
import { RegisterComponent } from './components/Auth-area/register/register.component';
import { ProductDetailsComponent } from './components/products-area/product-details/product-details.component';
import { EditProductComponent } from './components/products-area/edit-product/edit-product.component';
import { ProductListComponent } from './components/products-area/product-list/product-list.component';
import { LayoutComponent } from './components/layout-area/layout/layout.component';
import { NgModule } from '@angular/core';

export const APP_ROUTES : Routes = [
    { path: "home", component: HomeComponent },
    { path: "products", component: ProductListComponent },
    { path: "products/details/:id", component: ProductDetailsComponent },
    { path: "products/edit/:productId", component: EditProductComponent },    
    { path: "new", component: AddProductComponent },  
    { path: "login", component: LoginComponent },   
    { path: "register", component: RegisterComponent },   
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "**", component: Page404Component },
   
];


@NgModule({
    imports: [RouterModule.forRoot(APP_ROUTES )],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }


