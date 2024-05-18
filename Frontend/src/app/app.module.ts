import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AuthService } from './services/auth.service';

import { authReducer } from '../../src/app/NgRx/reducers/auth.reducer';
import { AuthEffects } from '../../src/app/NgRx/effects/auth.effects';



@NgModule({
  declarations: [    
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    StoreModule.forRoot({ auth: authReducer }),
    EffectsModule.forRoot([AuthEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25 })
  ],
  providers: [AuthService],
  bootstrap: []
})
export class AppModule { }
