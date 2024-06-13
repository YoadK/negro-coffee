import { tap, map, catchError } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { State, Action, StateContext, Selector,Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { Login, Logout, Register, AuthSuccess, AuthFailure, LoadStoredTokenAndUser } from '../actions/auth.actions';
import { UserModel } from '../../models/user.model';
import { of } from 'rxjs';

export interface IAuthState {
  user: UserModel | null;
  token: string | null;
  error: string | null;
  loading: boolean;
}

@State<IAuthState>({
  name: 'auth',
  defaults: {
    token: null,
    user: null,
    error: null,
    loading: false
  }
})
@Injectable()
export class AuthState {
  constructor(private authService: AuthService, private store: Store) {
    console.log('AuthState constructor called');
    this.store.dispatch(new LoadStoredTokenAndUser());
  }

  @Selector()
  static isAuthenticated(state: IAuthState): boolean {
    console.log('AuthState.isAuthenticated called');
    return state.token !== null;
  }

  @Selector()
  static user(state: IAuthState): UserModel | null {
    console.log('AuthState.user called');
    return state.user;
  }

  @Selector()
  static error(state: IAuthState): any {
    console.log('AuthState.error called');
    return state.error;
  }

  @Selector()
  static loading(state: IAuthState): boolean {
    console.log('AuthState.loading called');
    return state.loading;
  }

  @Action(Login)
  login({ patchState, dispatch }: StateContext<IAuthState>, { payload }: Login) {
    console.log('AuthState.login called with payload:', payload);
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
    console.log('AuthState.register called with payload:', payload);
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
    console.log('AuthState.logout called');
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
    console.log('AuthState.authSuccess called with payload:', payload);
    patchState({
      user: payload.user,
      token: payload.token,
      error: null,
      loading: false
    });
  }

  @Action(AuthFailure)
  authFailure({ patchState }: StateContext<IAuthState>, { payload }: AuthFailure) {
    console.log('AuthState.authFailure called with payload:', payload);
    patchState({
      error: payload.error,
      loading: false
    });
  }

  @Action(LoadStoredTokenAndUser)
  loadStoredTokenAndUser({ dispatch }: StateContext<IAuthState>) {
    console.log('AuthState.loadStoredTokenAndUser called');
    const storedUser = this.authService.getUserFromLocalStorage();
    const storedToken = this.authService.getTokenFromLocalStorage();
    if (storedUser && storedToken) {
      dispatch(new AuthSuccess({ user: storedUser, token: storedToken }));
    }
  }
  
}