import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../../NgRx/reducers/auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

export const selectToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.token
);

export const selectIsLoggedIn = createSelector(
  selectAuthState,
  (state: AuthState) => state.isLoggedIn
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);
