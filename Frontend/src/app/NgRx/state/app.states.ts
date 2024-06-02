import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';
import { authReducer } from '../reducers/auth.reducer';
import { AuthState } from './auth.state';

export interface AppState {
  auth: AuthState;
  // Add other feature states here as needed
  // e.g., profile: fromProfile.ProfileState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer
};

export const selectAuthState = createFeatureSelector<AppState>('auth');
