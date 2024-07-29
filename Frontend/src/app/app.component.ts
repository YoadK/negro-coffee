import { ChangeDetectorRef, Component } from '@angular/core';
import { LayoutComponent } from './components/layout-area/layout/layout.component';
import { SpinnerComponent } from './components/SharedArea/spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { SpinnerLoadingService } from './services/spinner.loading.service';
import { AuthService } from './services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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

    constructor(private spinnerLoadingService: SpinnerLoadingService, private authService: AuthService, private cdr: ChangeDetectorRef
    ) {
        this.isLoading$ = this.spinnerLoadingService.isLoading$;
        this.authService.loadStoredToken();

        this.isLoading$.pipe(
            takeUntilDestroyed(),
        ).subscribe(isLoading => {
            console.log('AppComponent - isLoading', isLoading);
            console.log('AppComponent - Current Time:', new Date().toISOString());
            this.cdr.detectChanges();
        });
    }
}