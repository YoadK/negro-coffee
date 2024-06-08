import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { authReducer } from './NgRx/reducers/auth.reducer';
import { AuthEffects } from './NgRx/effects/auth.effects';
import { AuthInterceptor } from './Utils/AuthInterceptors';
import { AuthService } from './services/auth.service';
import { RouterModule } from '@angular/router';
import { APP_ROUTES } from '../../src/app/app.routes';
import { environment } from '../../src/environments/environment';
import { AppComponent } from './app.component';
import { LayoutComponent } from './components/layout-area/layout/layout.component';
import { AuthMenuComponent } from '../../src/app/components/Auth-area/auth-menu/auth-menu.component';
import { NavbarComponent } from '../../src/app/components/layout-area/navbar/navbar.component';
import { HeaderComponent } from './components/HeaderArea/header/header.component';
import { FooterComponent } from './components/FooterArea/footer/footer.component';
import { RegisterComponent } from './components/Auth-area/register/register.component';

@NgModule({
  declarations: [  
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    AuthMenuComponent,
    FooterComponent,
    NavbarComponent,
    RegisterComponent
  ],
  imports: [   
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    StoreModule.forRoot({ auth: authReducer }),
    EffectsModule.forRoot([AuthEffects]),
    StoreModule.forFeature('auth', authReducer),
    StoreDevtoolsModule.instrument({
      name: 'Negro coffee shop',
      maxAge: 25,
      logOnly: environment.PRODUCTION,
      autoPause: true,
    }),  
    RouterModule.forRoot(APP_ROUTES)
  ],
  providers: [
    AuthService, 
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }