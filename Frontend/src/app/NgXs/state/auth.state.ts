import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Login, Logout, Register, AuthSuccess, AuthFailure } from '../actions/auth.actions';

export interface AuthStateModel {
  user: any;
  token: string;
  error: any;
  loading: boolean;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    user: null,
    token: null,
    error: null,
    loading: false
  }
})
export class AuthState {
  @Selector()
  static isAuthenticated(state: AuthStateModel): boolean {
    return state.token != null;
  }

  @Selector()
  static user(state: AuthStateModel): any {
    return state.user;
  }

  @Selector()
  static error(state: AuthStateModel): any {
    return state.error;
  }

  @Selector()
  static loading(state: AuthStateModel): boolean {
    return state.loading;
  }

  @Action(Login)
  login({ patchState, dispatch }: StateContext<AuthStateModel>, { payload }: Login) {
    patchState({ loading: true });
    // Simulate an API call
    setTimeout(() => {
      // Simulate success or failure
      const success = true; // replace with real API logic
      if (success) {
        const user = { email: payload.email, firstName: 'John', lastName: 'Doe' }; // replace with real user data
        const token = 'fake-jwt-token'; // replace with real token
        dispatch(new AuthSuccess({ user, token }));
      } else {
        dispatch(new AuthFailure({ error: 'Login failed' }));
      }
    }, 1000);
  }

  @Action(Register)
  register({ patchState, dispatch }: StateContext<AuthStateModel>, { payload }: Register) {
    patchState({ loading: true });
    // Simulate an API call
    setTimeout(() => {
      // Simulate success or failure
      const success = true; // replace with real API logic
      if (success) {
        const user = { email: payload.email, firstName: payload.firstName, lastName: payload.lastName }; // replace with real user data
        const token = 'fake-jwt-token'; // replace with real token
        dispatch(new AuthSuccess({ user, token }));
      } else {
        dispatch(new AuthFailure({ error: 'Registration failed' }));
      }
    }, 1000);
  }

  @Action(Logout)
  logout({ setState }: StateContext<AuthStateModel>) {
    setState({
      user: null,
      token: null,
      error: null,
      loading: false
    });
  }

  @Action(AuthSuccess)
  authSuccess({ patchState }: StateContext<AuthStateModel>, { payload }: AuthSuccess) {
    patchState({
      user: payload.user,
      token: payload.token,
      error: null,
      loading: false
    });
  }

  @Action(AuthFailure)
  authFailure({ patchState }: StateContext<AuthStateModel>, { payload }: AuthFailure) {
    patchState({
      error: payload.error,
      loading: false
    });
  }
}
