import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../state/auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectIsLoggedIn = createSelector(
    selectAuthState,
    (state: AuthState) => {
      console.log('IsLoggedIn selector called, state:', state);
      return state.isLoggedIn;
    }
  );
  
  export const selectUser = createSelector(
    selectAuthState,
    (state: AuthState) => {
      console.log('User selector called, state:', state);
      return state.user;
    }
  );
  
export const selectToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.token
);


export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);
