import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs/operators';
import { SpinnerLoadingService } from '../../../services/spinner.loading.service';

@Component({
    selector: 'app-spinner',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './spinner.component.html',
    styleUrl: './spinner.component.module.scss'
})
export class SpinnerComponent implements OnInit, OnDestroy {
    isLoading$: Observable<boolean>;
    private subscription: Subscription;

    constructor(private spinnerLoadingService: SpinnerLoadingService) { }

    ngOnInit() {
        this.isLoading$ = this.spinnerLoadingService.isLoading$;
        this.subscription = this.isLoading$.pipe(
          tap(isLoading => {
            console.log('SpinnerComponent: Loading state changed:', isLoading);
            console.log('SpinnerComponent: Current Time:', new Date().toISOString());
          })
        ).subscribe();
    }
    
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}