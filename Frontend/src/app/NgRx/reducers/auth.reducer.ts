import { createReducer, on } from '@ngrx/store';
import { UserModel } from '../../models/user.model';
import * as AuthActions from '../../NgRx/actions/auth.actions';

export interface AuthState {
  user: UserModel | null;
  isAuthenticated: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.registerSuccess, AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true,
    error: null,
  })),
  on(AuthActions.registerFailure, AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(AuthActions.logoutSuccess, state => ({
    ...state,
    user: null,
    isAuthenticated: false,
    error: null,
  }))
);