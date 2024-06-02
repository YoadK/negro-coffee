import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { UserModel } from '../../../models/user.model';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { AppState, selectAuthState } from '../../../NgRx/state/app.states';
import * as AuthActions from '../../../NgRx/actions/auth.actions';
import { selectIsLoggedIn, selectUser } from '../../../NgRx/Selectors/auth.selectors';;
import { AuthState } from '../../../NgRx/state/auth.state';
import { takeUntil, take, filter } from 'rxjs/operators';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.module.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    user: UserModel = new UserModel();
    getState: Observable<any>;
    errorMessage: string | null;
    successMessage: string | null;

    private destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(private router: Router, private store: Store<AppState>, private authService: AuthService) {
        this.getState = this.store.select(selectAuthState);
    }

    ngOnInit() {
        this.getState.pipe(takeUntil(this.destroy$)).subscribe((state) => {
            console.log('Auth state:', state);
            this.errorMessage = state.errorMessage;
            if (state.isAuthenticated) {
                console.log('user is authenticated');
                this.successMessage = 'Login successful!';
                this.router.navigate(['/']); // Navigate to home on successful login
            } else {
                this.successMessage = null;
            }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    onSubmit(): void {
        const payload = {
            email: this.user.email,
            password: this.user.password
        };
        console.log('Dispatching login with payload:', payload);
        this.store.dispatch(AuthActions.Login(payload));

        // Subscribe to the authentication state and set the token on success
        this.store.select(selectAuthState).pipe(
            take(1),

            filter((state: AppState) => state.auth && state.auth.isAuthenticated) //This ensures that the filter operator only passes through the state when the auth property is defined and its isAuthenticated property is true.
            // In the subscribe callback, an additional check is added to 
            //ensure that the auth property and its user property exist 
            //before accessing the token property
        ).subscribe((state: AppState) => {
            if (state.auth && state.auth.user) {
                this.authService.setToken(state.auth.user.token);
            }
        });
    }
}