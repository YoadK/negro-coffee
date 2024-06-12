import { tap, map, catchError } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { Login, Logout, Register, AuthSuccess, AuthFailure } from '../actions/auth.actions';
import { UserModel } from '../../models/user.model'; // Adjust the import path as necessary
import { of } from 'rxjs';

export interface IAuthState {
  user: UserModel | null; // Use UserModel type
  token: string | null;
  error: string | null;
  loading: boolean;
}

@State<IAuthState>({
  name: 'auth',
  defaults: {
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user')),
    error: null,
    loading: false
  }
})
@Injectable()
export class AuthState {
  constructor(private authService: AuthService) {}

  @Selector()
  static isAuthenticated(state: IAuthState): boolean {
    return state.token != null;
  }

  @Selector()
  static user(state: IAuthState): UserModel | null {
    return state.user;
  }

  @Selector()
  static error(state: IAuthState): any {
    return state.error;
  }

  @Selector()
  static loading(state: IAuthState): boolean {
    return state.loading;
  }

  @Action(Login)
  login({ patchState, dispatch }: StateContext<IAuthState>, { payload }: Login) {
    patchState({ loading: true });
    return this.authService.login(payload).pipe(
      map(response => {
        const user = response.user;
        const token = response.token;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        dispatch(new AuthSuccess({ user, token }));
      }),
      catchError(error => {
        dispatch(new AuthFailure({ error: error.message }));
        throw error;
      })
    );
  }

  @Action(Register)
  register({ patchState, dispatch }: StateContext<IAuthState>, { payload }: Register) {
    patchState({ loading: true });
    return this.authService.register(payload).pipe(
      map(response => {
        const user = response.user;
        const token = response.token;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        dispatch(new AuthSuccess({ user, token }));
      }),
      catchError(error => {
        dispatch(new AuthFailure({ error: error.message }));
        throw error;
      })
    );
  }

  @Action(Logout)
  logout({ setState }: StateContext<IAuthState>) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setState({
      user: null,
      token: null,
      error: null,
      loading: false
    });
  }

  @Action(AuthSuccess)
  authSuccess({ patchState }: StateContext<IAuthState>, { payload }: AuthSuccess) {
    patchState({
      user: payload.user,
      token: payload.token,
      error: null,
      loading: false
    });
  }

  @Action(AuthFailure)
  authFailure({ patchState }: StateContext<IAuthState>, { payload }: AuthFailure) {
    patchState({
      error: payload.error,
      loading: false
    });
  }
}
