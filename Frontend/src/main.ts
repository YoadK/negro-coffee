import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from './app/NgXs/state/auth.state';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; 
import { CartState } from './app/NgXs/state/cart.state';


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(NgxsModule.forRoot([AuthState,CartState])),
    importProvidersFrom(HttpClientModule)
    
  ]
}).catch(err => console.error(err));