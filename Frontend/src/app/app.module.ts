
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import {  RouterModule} from '@angular/router';
import {routes} from '../../src/app/app.routes';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from './NgXs/state/auth.state';

@NgModule({
  declarations: [     
     
  ],
  imports: [
    BrowserModule,    
   
    
   
    
    

  ],

  providers: [],
  bootstrap: []
})
export class AppModule { }