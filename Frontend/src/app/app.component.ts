import { Component } from '@angular/core';
import { LayoutComponent } from './components/layout-area/layout/layout.component';
import { SpinnerComponent } from './components/SharedArea/spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { SpinnerLoadingService } from './services/spinner.loading.service';
import { AuthService } from './services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.module.scss'],
    standalone: true,
    imports: [LayoutComponent, SpinnerComponent, CommonModule]
})
export class AppComponent {
    title = 'AppComponent';
    isLoading$: Observable<boolean>;

    constructor(
        private spinnerLoadingService: SpinnerLoadingService,
        private authService: AuthService
    ) {
        this.isLoading$ = this.spinnerLoadingService.isLoading$;
        this.authService.loadStoredToken();
    }
}