import { createReducer, on } from '@ngrx/store';
import * as AuthActions from '../actions/auth.actions';
import { UserModel } from '../../models/user.model';
import { setUser, clearUser } from '../actions/auth.actions';

export interface AuthState {
  user: UserModel | null;
  token: string | null;
  error: string | null;
  isLoggedIn: boolean;
}

export const initialState: AuthState = {
  user: null,
  token: null,
  error: null,
  isLoggedIn: false,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.loadUserFromLocalStorageSuccess, (state, { user, token }) => {
    console.log('Reducer: loadUserFromLocalStorageSuccess called');
    console.log('User:', user);
    console.log('Token:', token);
    return {
      ...state,
      user,
      token,
      error: null,
      isLoggedIn: true,
    };
  }),
  on(AuthActions.loadUserFromLocalStorageFailure, (state) => {
    console.log('Reducer: loadUserFromLocalStorageFailure called');
    return {
      ...state,
      user: null,
      token: null,
      error: 'Failed to load user from local storage',
      isLoggedIn: false,
    };
  }),
  on(AuthActions.registerSuccess, (state, { user, token }) => {
    console.log('Reducer: registerSuccess called');
    console.log('User:', user);
    console.log('Token:', token);
    return {
      ...state,
      user,
      token,
      error: null,
      isLoggedIn: true,
    };
  }),
  on(AuthActions.registerFailure, (state, { error }) => {
    console.log('Reducer: registerFailure called');
    console.log('Error:', error);
    return {
      ...state,
      error,
      isLoggedIn: false,
    };
  }),
  on(AuthActions.loginSuccess, (state, { user, token }) => {
    console.log('Reducer: loginSuccess called');
    console.log('User:', user);
    console.log('Token:', token);
    return {
      ...state,
      user,
      token,
      error: null,
      isLoggedIn: true,
    };
  }),
  on(AuthActions.loginFailure, (state, { error }) => {
    console.log('Reducer: loginFailure called');
    console.log('Error:', error);
    return {
      ...state,
      error,
      isLoggedIn: false,
    };
  }),
  on(AuthActions.logoutSuccess, (state) => {
    console.log('Reducer: logoutSuccess called');
    return {
      ...state,
      user: null,
      token: null,
      error: null,
      isLoggedIn: false,
    };
  }),
  on(setUser, (state, { user }) => ({ ...state, user })),
  on(clearUser, state => ({ ...state, user: null }))
);
