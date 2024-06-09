import { Selector } from '@ngxs/store';
import { AuthState, AuthStateModel } from '../state/auth.state';

export class AuthSelectors {
  static isLoggedIn(state: AuthStateModel): boolean {
    return AuthState.isAuthenticated(state);
  }

  static userRole(state: AuthStateModel): string | null {
    const user = AuthState.user(state);
    return user ? user.role : null;
  }
}