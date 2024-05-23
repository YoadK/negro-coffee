// src/app/ngrx/state/auth.state.ts

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
