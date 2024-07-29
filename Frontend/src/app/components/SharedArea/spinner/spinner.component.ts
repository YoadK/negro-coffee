import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs/operators';
import { SpinnerLoadingService } from '../../../services/spinner.loading.service';
import { Component, ChangeDetectorRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-spinner',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './spinner.component.html',
    styleUrl: './spinner.component.module.scss'
})
export class SpinnerComponent {
    isLoading$: Observable<boolean>;

    constructor(
        private spinnerLoadingService: SpinnerLoadingService, 
        private cdr: ChangeDetectorRef
    ) {
        this.isLoading$ = this.spinnerLoadingService.isLoading$.pipe(
            tap(isLoading => {
                console.log('SpinnerComponent: Loading state changed:', isLoading);
                console.log('SpinnerComponent: Current Time:', new Date().toISOString());
                // Manually trigger change detection
                this.cdr.detectChanges();
            }),
            takeUntilDestroyed()
        );
    }
}