import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import * as AuthActions from '../../NgRx/actions/auth.actions';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap(action =>
        this.authService.register(action.user).pipe(
          map(user => {
            console.log('User registered, dispatching registerSuccess:', user);
            return AuthActions.registerSuccess({ user });
          }),
          catchError(error => {
            console.error('Registration error:', error);
            return of(AuthActions.registerFailure({ error }));
          })
        )
      )
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(action =>
        this.authService.login(action.credentials).pipe(
          map(user => {
            console.log('User logged in, dispatching loginSuccess:', user);
            return AuthActions.loginSuccess({ user });
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

  init$ = createEffect(() =>
    of(this.authService.loadStoredToken()).pipe(
      map(token => {
        if (token !== null) {
          const user = this.authService.currentUserValue;
          console.log('Token found, user:', user);
          return AuthActions.loginSuccess({ user });
        } else {
          console.log('No token found, dispatching logoutSuccess');
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
