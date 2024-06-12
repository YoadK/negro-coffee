import { Selector } from '@ngxs/store';
import { AuthState, IAuthState } from '../state/auth.state';

export class AuthSelectors { // Ensure this class is exported
  static isLoggedIn(state: IAuthState): boolean {
    return AuthState.isAuthenticated(state);
  }

  static userRole(state: IAuthState): string | null {
    const user = AuthState.user(state);
    return user ? user.role : null;
  }
}
