// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/Utils/app.config';


// import { AppComponent } from './app/app.component';

// bootstrapApplication(AppComponent, appConfig)
//     .catch((err) => console.error(err));


import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/Utils/app.config';
import { AppComponent } from './app/app.component';
import { provideStore } from '@ngrx/store';
// import { authReducer } from './app/NgRx/reducers/auth.reducer';
import { reducers } from './app/NgRx/state/app.states';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers || [],
    // provideStore({ auth: authReducer }),
    provideStore(reducers)
  ],
})
  .catch((err) => console.error(err));