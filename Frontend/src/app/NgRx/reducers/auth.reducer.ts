// src/app/ngrx/reducers/auth.reducer.ts

import { createReducer, on, Action } from '@ngrx/store';
import * as AuthActions from '../actions/auth.actions';
import { AuthState, initialState } from '../state/auth.state';


const _authReducer = createReducer(
  initialState,
  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    // token: user.token, // Assuming the token is part of the user model
    isLoggedIn: true,
    error: null,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
    isLoggedIn: false,
  })),
  on(AuthActions.logout, state => ({
    ...state,
    user: null,
    // token: null,
    isLoggedIn: false,
    error: null,
  }))
);

export function authReducer(state: AuthState | undefined, action: Action) {
  return _authReducer(state, action);
}
