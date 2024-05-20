import { createReducer, on } from '@ngrx/store';
import * as AuthActions from '../../NgRx/actions/auth.actions';
import { UserModel } from '../../models/user.model';

export interface AuthState {
  user: UserModel | null;
  token: string | null;
  isLoggedIn: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  token: null,
  isLoggedIn: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    // token: user.token,
    isLoggedIn: true,
    error: null
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
    isLoggedIn: false
  })),
  on(AuthActions.logout, state => ({
    ...state,
    user: null,
    // token: null,
    isLoggedIn: false,
    error: null
  }))
);
