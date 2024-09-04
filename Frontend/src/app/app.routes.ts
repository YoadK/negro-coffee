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
import {MyAccountComponent} from './components/my-account-area/my-account/my-account.component';
import { AuthGuard } from './services/guards/auth.guard';
import { ProductsManagementComponent } from './components/products-area/products-management/products-management.component';


export const routes: Routes = [
    { path: "home", component: HomeComponent },
    { path: "products", component: ProductListComponent },
    { path: "products/details/:id", component: ProductDetailsComponent },
    { path: "products/edit/:id", component: EditProductComponent, canActivate: [AuthGuard] },
    { path: "product-management", component: ProductsManagementComponent, canActivate: [AuthGuard] },

    
    

    { path: "new", component: AddProductComponent },  
    { path: "login", component: LoginComponent },   
    { path: "register", component: RegisterComponent },   
    { path: "my-account", component: MyAccountComponent, canActivate: [AuthGuard]},   
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "**", component: Page404Component },
    {
        path: '',
        component: LayoutComponent,
        children: [
          { path: 'home', component: HomeComponent },
          // other routes
        ]
      }
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }


