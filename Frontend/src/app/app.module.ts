import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LayoutComponent } from './components/layout-area/layout/layout.component';
import { HeaderComponent } from './components/HeaderArea/header/header.component';
import { FooterComponent } from './components/FooterArea/footer/footer.component';
import { AppRoutingModule } from './app.routes';
import { AuthInterceptor } from './Utils/AuthInterceptors';
import { AuthService } from './services/auth.service';
import { environment } from '../environments/environment';
import { ROOT_REDUCERS } from './NgRx/reducers';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    StoreModule.forRoot(ROOT_REDUCERS),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      name: 'Negro coffee shop',
      maxAge: 25,
      logOnly: environment.PRODUCTION,
      autoPause: true
    }),
    RouterModule.forRoot([]), // Assuming AppRoutingModule is configured correctly
    AppRoutingModule
  ],
  providers: [
    AuthService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
