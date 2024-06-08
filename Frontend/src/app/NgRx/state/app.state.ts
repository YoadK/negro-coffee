import { AuthState } from '../reducers/auth.reducer';

export interface AppState {
  auth: AuthState; // Add other slices of state as needed
}