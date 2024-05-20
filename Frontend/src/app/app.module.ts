import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { authReducer } from '../../src/app/NgRx/reducers/auth.reducer';
import { AuthEffects } from '../../src/app/NgRx/effects/auth.effects';
import { AuthInterceptor } from './Utils/AuthInterceptors';



@NgModule({
  declarations: [    
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    StoreModule.forRoot({ auth: authReducer }), 
    StoreModule.forFeature('auth', authReducer), // Include StoreModule for the feature  
    EffectsModule.forRoot([AuthEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25 }),
    HttpClientModule

  ],
  providers: [ { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } ],
  bootstrap: []
})
export class AppModule { }
