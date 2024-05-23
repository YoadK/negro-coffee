// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/Utils/app.config';


// import { AppComponent } from './app/app.component';

// bootstrapApplication(AppComponent, appConfig)
//     .catch((err) => console.error(err));


import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/Utils/app.config';
import { AppComponent } from './app/app.component';
import { provideStore } from '@ngrx/store';
import { authReducer } from './app/NgRx/reducers/auth.reducer';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers || [],
    provideStore({ auth: authReducer }),
  ],
})
  .catch((err) => console.error(err));