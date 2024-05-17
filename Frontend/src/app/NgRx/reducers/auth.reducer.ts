import { createReducer, on } from '@ngrx/store';
import { IUserModel } from '../../models/user.model';
import * as AuthActions from '../../NgRx/actions/auth.actions';

export interface AuthState {
  user: IUserModel | null;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.registerSuccess, AuthActions.loginSuccess, (state, { user }) => ({ ...state, user, error: null })),
  on(AuthActions.registerFailure, AuthActions.loginFailure, (state, { error }) => ({ ...state, error })),
  on(AuthActions.logoutSuccess, state => ({ ...state, user: null, error: null }))
);
