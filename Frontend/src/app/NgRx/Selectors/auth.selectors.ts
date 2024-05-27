import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../state/auth.state';
import { UserModel } from '../../models/user.model';
import { RoleModel } from '../../../../../Backend/src/3-models/role-model';

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

export const selectUserRole = createSelector(
  selectUser,
  (user: UserModel | null) => {
    if (user) {
      switch (user.roleId) {
        case RoleModel.Admin:
          return 'Admin';
        case RoleModel.User:
          return 'User';
        default:
          return null;
      }
    }
    return null;
  }
);
