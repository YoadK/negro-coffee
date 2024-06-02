import { Action, createReducer, on } from '@ngrx/store';
import { UserModel } from '../../models/user.model';
import { AuthState, initialAuthState } from '../../NgRx/state/auth.state';
import * as AuthActions from '../actions/auth.actions';


const _authReducer = createReducer(
  initialAuthState,
  
  on(AuthActions.LoginSuccess, (state, { user }) => ({
    ...state,
    isAuthenticated: true,
    user,
    errorMessage: null,
    successMessage: 'Login successful!'
  })),

  on(AuthActions.LoginFailure, (state, { error }) => ({
    ...state,
    errorMessage: 'Incorrect email and/or password.'
  })),

  on(AuthActions.SignupSuccess, (state, { user }) => ({
    ...state,
    isAuthenticated: true,
    user,
    errorMessage: null,
    successMessage: 'Signup successful!'
  })),

  on(AuthActions.SignupFailure, (state, { error }) => ({
    ...state,
    errorMessage: 'That email is already in use.'
  })),

  on(AuthActions.Logout, () => ({
    ...initialAuthState,
    successMessage: 'Logout successful!'
  }))
);

export function authReducer(state: AuthState | undefined, action: Action) {
  return _authReducer(state, action);
}
