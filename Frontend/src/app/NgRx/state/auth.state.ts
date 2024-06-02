// src/app/ngrx/state/auth.state.ts
import { UserModel } from '../../models/user.model';

export interface AuthState {
  isAuthenticated: boolean;
  user: UserModel | null;
  userToken: string | null;
  errorMessage: string | null;
  successMessage: string | null;
}

export const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  userToken: null,
  errorMessage: null,
  successMessage: null
};

