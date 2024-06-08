
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AuthInterceptor } from './Utils/AuthInterceptors';
import { AuthService } from './services/auth.service';
import { LayoutComponent } from './components/layout-area/layout/layout.component';
import { Router , RouterModule, RouterOutlet} from '@angular/router';
import {routes} from '../../src/app/app.routes';
import { environment } from '../../src/environments/environment';
import { HeaderComponent } from './components/HeaderArea/header/header.component';
import { FooterComponent } from './components/FooterArea/footer/footer.component';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from './NgXs/state/auth.state';
import { LoginComponent } from './components/Auth-area/login/login.component';
import { RegisterComponent } from './components/Auth-area/register/register.component';
import { AuthMenuComponent } from './components/Auth-area/auth-menu/auth-menu.component';

@NgModule({
  declarations: [ 
    AppComponent,
    LoginComponent,
    RegisterComponent,
    AuthMenuComponent    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgxsModule.forRoot([AuthState]),
    RouterModule.forRoot(routes)   
     
   
    
    

  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }