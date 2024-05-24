// src/app/ngrx/reducers/auth.reducer.ts

import { createReducer, on, Action } from '@ngrx/store';
import * as AuthActions from '../actions/auth.actions';
import { AuthState, initialState } from '../state/auth.state';

const _authReducer = createReducer(
  initialState,

  on(AuthActions.loginSuccess, (state, { user }) => {
    const newState = {
      ...state,
      user,
      isLoggedIn: true,
      error: null as string | null, // Explicitly specify the type as string | null
    };
    console.log('Login Success State:', newState);
    return newState;
  }),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
    isLoggedIn: false,
  })),
  
  on(AuthActions.logout, (state) => ({
    ...state,
    user: null,
    isLoggedIn: false,
    error: null as string | null, // Explicitly specify the type as string | null
  }))
);

export function authReducer(state: AuthState | undefined, action: Action) {
  return _authReducer(state, action);
}