// import { Injectable } from '@angular/core';
// import { Actions, createEffect, ofType } from '@ngrx/effects';
// import { map, catchError, switchMap } from 'rxjs/operators';
// import { of } from 'rxjs';
// import { loginSuccess, loginFailure } from '../actions/auth.actions';
// import { AuthService } from '../../services/auth.service';

// @Injectable()
// export class LoginEffects {
//   login$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType('[Login] User Login'),
//       switchMap(({ username, password }) =>
//         this.authService.login(username, password).pipe(
//           map(token => loginSuccess({ token })),
//           catchError(error => of(loginFailure({ error })))
//         )
//       )
//     )
//   );

//   constructor(private actions$: Actions, private authService: AuthService) {}
// }