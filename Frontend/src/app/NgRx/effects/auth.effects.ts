import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import * as AuthActions from '../actions/auth.actions';

@Injectable()
export class AuthEffects {

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.Login),
      switchMap(action => {
        return this.authService.login(action.email, action.password).pipe(
          map(user => AuthActions.LoginSuccess({ user })),
          catchError(error => of(AuthActions.LoginFailure({ error: error.message })))
        );
      })
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.LoginSuccess),
      tap(({ user }) => {
        localStorage.setItem('token', user.token);
        this.router.navigateByUrl('/');
      })
    ), { dispatch: false }
  );

  loginFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.LoginFailure),
      tap(({ error }) => {
        console.error('Login failed:', error);
      })
    ), { dispatch: false }
  );

  signUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.Signup),
      switchMap(action => {
        return this.authService.register(action.email, action.password).pipe(
          map(user => AuthActions.SignupSuccess({ user })),
          catchError(error => of(AuthActions.SignupFailure({ error: error.message })))
        );
      })
    )
  );

  signUpSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.SignupSuccess),
      tap(({ user }) => {
        localStorage.setItem('token', user.token);
        this.router.navigateByUrl('/');
      })
    ), { dispatch: false }
  );

  signUpFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.SignupFailure),
      tap(({ error }) => {
        console.error('Signup failed:', error);
      })
    ), { dispatch: false }
  );

  logOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.Logout),
      tap(() => {
        localStorage.removeItem('token');
      })
    ), { dispatch: false }
  );
}
