import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import * as AuthActions from '../../NgRx/actions/auth.actions';
import { Router } from '@angular/router';
import { UserModel } from '../../models/user.model';

@Injectable()
export class AuthEffects {
    constructor(
        private actions$: Actions,
        private authService: AuthService,
        private router: Router
    ) { }

    loadUserFromLocalStorage$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.loadUserFromLocalStorage),
            switchMap(() => {
                const user = this.authService.getUserFromLocalStorage();
                const token = this.authService.getTokenFromLocalStorage();
                console.log('User loaded from local storage:', user);
                console.log('Token loaded from local storage:', token);
                if (user && token) {
                    console.log('User and token found in local storage:', user, token);
                    return of(AuthActions.loadUserFromLocalStorageSuccess({ user, token }));
                } else {
                     console.log('No user or token found in local storage');
                    return of(AuthActions.loadUserFromLocalStorageFailure());
                }
            })
        )
    );
    register$ = createEffect(() =>
        this.actions$.pipe(
          ofType(AuthActions.register),
          mergeMap(action =>
            this.authService.register(action.user).pipe(
              map(response => {
                console.log('User registered, dispatching registerSuccess:', response.user);
                return AuthActions.registerSuccess({ user: response.user, token: response.token });
              }),
              catchError(error => {
                console.error('Registration error:', error);
                return of(AuthActions.registerFailure({ error }));
              })
            )
          )
        )
      );

    // The login$ effect handles the login process and dispatches the loginSuccess action upon successful login
    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.login),
            mergeMap(action =>
                this.authService.login(action.credentials).pipe(
                    map(response => {
                        const user = response.user;
                        const token = response.token;
                        console.log('User logged in:', user);
                        console.log('Token received:', token);
                        console.log('User logged in, dispatching loginSuccess:', user);
                        return AuthActions.loginSuccess({ user, token });
                    }),
                    catchError(error => {
                        console.error('Login error:', error);
                        return of(AuthActions.loginFailure({ error }));
                    })
                )
            )
        )
    );

    logout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.logout),
            tap(() => {
                this.authService.logout();
                console.log('User logged out, dispatching logoutSuccess');
            }),
            map(() => AuthActions.logoutSuccess())
        )
    );

    //The init$ effect is responsible for checking the presence of the user and token in the local
    // storage when the application starts. 
    init$ = createEffect(() =>
      
        of(null).pipe(
            tap(() => {
                console.log('init$ effect triggered');
                console.info('init$ effect triggered');
                console.trace('init$ effect triggered');
              }),
              
            map(() => {                
                const storedToken = localStorage.getItem('token');                
                const storedUser = localStorage.getItem('user');
                
                console.log('Stored token:', storedToken);
                console.log('Stored user:', storedUser);
                if (storedToken && storedUser) {
                    const user = JSON.parse(storedUser) as UserModel;
                    console.log('Token and user found, dispatching loginSuccess:', user);
                    return AuthActions.loginSuccess({ user, token: storedToken }); 
                } else {
                    console.log('No token or user found, dispatching logoutSuccess');
                    return AuthActions.logoutSuccess();
                }
            })
        )
    );

    logoutRedirect$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(AuthActions.logoutSuccess),
                tap(() => this.router.navigate(['/login']))
            ),
        { dispatch: false }
    );
}
