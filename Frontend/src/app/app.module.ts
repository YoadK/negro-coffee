import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { authReducer } from '../../src/app/NgRx/reducers/auth.reducer';
import { AuthEffects } from '../../src/app/NgRx/effects/auth.effects';
import { AuthService } from './services/auth.service';


@NgModule({
  declarations: [
    
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({ auth: authReducer }),
    EffectsModule.forRoot([AuthEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25 })
  ],
  providers: [AuthService],
  bootstrap: []
})
export class AppModule { }
