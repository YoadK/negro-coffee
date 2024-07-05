import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthState } from '../../../NgXs/state/auth.state';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs/operators';
import { LogCurrentState } from '../../../NgXs/actions/auth.actions';

@Component({
    selector: 'app-spinner',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './spinner.component.html',
    styleUrl: './spinner.component.module.scss'

})
export class SpinnerComponent implements OnInit {
    @Select(AuthState.isLoading) isLoading$: Observable<boolean>;

    constructor(private store: Store) { }
    // private subscription: Subscription;
    //original version
    // ngOnInit() {
    //     this.isLoading$.subscribe(isLoading => {
    //       console.log('Spinner isLoading:', isLoading);
    //     });
    //   }

    //second version
    // ngOnInit() {
    //     // This will log all state changes without creating a separate subscription
    //     this.isLoading$ = this.isLoading$.pipe(
    //       tap(isLoading => console.log('Loading state changed:', isLoading))
    //     );
    //   }

    //third version:
    // ngOnInit() {
    //     this.isLoading$.pipe(
    //       tap(isLoading => console.log('Loading state changed:', isLoading))
    //     ).subscribe();
    //   }

    ngOnInit() {


    }
}



