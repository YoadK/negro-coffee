import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LayoutComponent } from './components/layout-area/layout/layout.component';
import { SpinnerComponent } from './components/SharedArea/spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { AuthState } from './NgXs/state/auth.state';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { SpinnerLoadingService } from './services/spinner.loading.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.module.scss'],
    standalone: true,
    imports: [LayoutComponent, SpinnerComponent, CommonModule]
})


export class AppComponent implements OnInit {
    title = 'AppComponent ';
    isLoading$: Observable<boolean>;

    constructor(private spinnerLoadingService: SpinnerLoadingService,private authService: AuthService,private cdr: ChangeDetectorRef    ) {
        this.isLoading$ = this.spinnerLoadingService.isLoading$;
     }

     ngOnInit() {
        console.log('AppComponent.ngOnInit called');
        this.authService.loadStoredToken();
    
        this.isLoading$.subscribe(isLoading => {
          console.log('AppComponent - isLoading', isLoading);
          console.log('AppComponent - Current Time:', new Date().toISOString());
          this.cdr.detectChanges(); // Ensure change detection runs after setting isLoading
        });
      }
}




