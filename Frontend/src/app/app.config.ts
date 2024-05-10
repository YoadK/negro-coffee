import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig = {
    providers: [provideRouter(routes), provideHttpClient()],//provideHttpClient() is similar to 'axios', but it doesnt return 'promise' it returns 'observable'

    categoriesUrl: "http://localhost:4000/api/categories/",
    searchUrl: "http://localhost:4000/api/search/",
    productsUrl: "http://localhost:4000/api/products/",
    productAddUrl: "http://localhost:4000/api/products/new",
    registerUrl: "http://localhost:4000/api/register/",
    loginUrl: "http://localhost:4000/api/login/",


};
