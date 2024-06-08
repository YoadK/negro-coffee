import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

import { APP_ROUTES  } from './app/app.routes';

import { AppEffects } from './app/NgRx/effects';
import { AllReducers } from './app/NgRx/reducers';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { authReducer } from './app/NgRx/reducers/auth.reducer'


bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(APP_ROUTES),
    provideStore({ auth: authReducer }),
    provideEffects(AppEffects)
  ]
}).catch(err => console.error(err));
