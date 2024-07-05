import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from './components/layout-area/layout/layout.component';
import { AuthService } from './services/auth.service';
import { SpinnerComponent } from './components/SharedArea/spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { AuthState } from './NgXs/state/auth.state';
import { Observable } from 'rxjs';
import {Select} from '@ngxs/store';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.module.scss'],
  standalone: true,
  imports: [LayoutComponent,SpinnerComponent,CommonModule]
})


export class AppComponent implements OnInit {
    title = 'AppComponent ';
    @Select(AuthState.isLoading) isLoading$: Observable<boolean>;
    
    constructor(private authService: AuthService) {}
  
    ngOnInit() {
        console.log('AppComponent.ngOnInit called');
      this.authService.loadStoredToken();
      
      this.isLoading$.subscribe(isLoading => {
        console.log('AppComponent - isLoading', isLoading);
        console.log('AppComponent - Current Time:', new Date().toISOString());
      });
    }
  }




