
import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// import { authReducer } from './NgRx/reducers/auth.reducer';
import { AuthEffects } from './NgRx/effects/auth.effects';

import { AuthInterceptor } from './Utils/AuthInterceptors';

import { AuthService } from './services/auth.service';

import { RouterModule} from '@angular/router';
import {routes} from '../../src/app/app.routes';
import { environment } from '../../src/environments/environment';
import { reducers } from './NgRx/state/app.states';
import { provideStore } from '@ngrx/store';


@NgModule({
  declarations: [     
    
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    // StoreModule.forRoot({ auth: authReducer }),
    StoreModule.forRoot(reducers , {}), 
    EffectsModule.forRoot([AuthEffects]),
    // StoreModule.forFeature('auth', authReducer), // Include StoreModule for the feature  
   
    StoreDevtoolsModule.instrument({
	name: 'Negro coffee shop',
        maxAge: 25, // Retains last 25 states
        logOnly:environment.PRODUCTION, //environment.production, // Restrict extension to log-only mode
        autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      }),  
    RouterModule.forRoot(routes)
    
    

  ],
//   exports:[HeaderComponent,FooterComponent],
  providers: [AuthService, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },provideStore(reducers)],
  bootstrap: []
})
export class AppModule { }