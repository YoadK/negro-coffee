import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from './app/NgXs/state/auth.state';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { CartState } from './app/NgXs/state/cart.state';
import { HttpRequestsInterceptor } from './app/Utils/HttpRequestsInterceptor';
import { SpinnerLoadingService } from './app/services/spinner.loading.service';


bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routes),
        importProvidersFrom(NgxsModule.forRoot([AuthState, CartState])),
        importProvidersFrom(HttpClientModule),
        provideHttpClient(),
        SpinnerLoadingService,
        { provide: HTTP_INTERCEPTORS, useClass: HttpRequestsInterceptor, multi: true }

    ],

}).catch(err => console.error(err));