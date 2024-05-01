import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig = {
    providers: [provideRouter(routes), provideHttpClient()],

    categoriesUrl: "http://localhost:4000/api/categories/",
    searchUrl: "http://localhost:4000/api/search/",
    productsUrl: "http://localhost:4000/api/products/",
    registerUrl: "http://localhost:4000/api/register/",
    loginUrl: "http://localhost:4000/api/login/",


};
