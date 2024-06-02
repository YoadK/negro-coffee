import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../state/auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(
    selectAuthState,
    (state: AuthState) => state.user
  );
  export const selectToken = createSelector(selectAuthState, state => state.userToken);
export const selectIsLoggedIn = createSelector(
    selectAuthState,
    (state: AuthState) => state.isAuthenticated
  );