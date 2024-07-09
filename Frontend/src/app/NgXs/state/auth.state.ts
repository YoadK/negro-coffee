import { tap, map, catchError } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { State, Action, StateContext, Selector, Store, dispatch } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { Login, Logout, Register, AuthSuccess, AuthFailure, LoadStoredTokenAndUser, LogCurrentState } from '../actions/auth.actions';
import { UserModel } from '../../models/user.model';
import { of, throwError } from 'rxjs';
import { ClearCart, LoadUserCart } from '../actions/cart.actions';
import { SpinnerLoadingService } from '../../services/spinner.loading.service';



//AuthState - responsible for managing the authentication state of the application.

export interface IAuthState {
    user: UserModel | null;
    token: string | null;
    error: string | null;
    // isLoading: boolean;
}

@State<IAuthState>({
    name: 'auth',
    defaults: {
        token: null,
        user: null,
        error: null,
        // isLoading: false
    }
})

@Injectable()
export class AuthState {

    constructor(private authService: AuthService, private store: Store,private spinnerLoadingService: SpinnerLoadingService) {
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
    static error(state: IAuthState): string | null {
        console.log('AuthState.error called.');

        if (state.error) {
            console.log('error: ', state.error?.toString());
        }
        return state.error;
    }



    @Action(Login)
    login({ patchState, dispatch }: StateContext<IAuthState>, { payload }: Login) {
        console.log('AuthState.login called with payload:', payload);
        // patchState({ isLoading: true });

        return this.authService.login(payload).pipe(
            tap((response: { user: UserModel; token: string }) => {
                try {
                    const user = response.user;
                    const token = response.token;
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));
                    dispatch(new AuthSuccess({ user, token }));
                } catch (error) {
                    console.error('Error in login tap:', error);
                    throw error;
                }
            }),
            catchError(error => {
                dispatch(new AuthFailure({ error: error.message }));
                return throwError(error);
            })
        );
    }

    @Action(Register)
    register({ patchState, dispatch }: StateContext<IAuthState>, { payload }: Register) {
        console.log('AuthState.register called with payload:', payload);
        // patchState({ isLoading: true });

        return this.authService.register(payload).pipe(
            tap((response: { user: UserModel; token: string }) => {
                try {  // <-- Added try-catch
                    const user = response.user;
                    const token = response.token;
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));
                    dispatch(new AuthSuccess({ user, token }));
                } catch (error) {
                    console.error('Error in register tap:', error);
                    throw error;
                }
            }),
            catchError(error => {
                dispatch(new AuthFailure({ error: error.message }));
                return throwError(error);
            })
        );
    }

    @Action(Logout)
    logout({ setState, getState, dispatch }: StateContext<IAuthState>) {
        console.log('AuthState.logout called');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setState({
            user: null,
            token: null,
            error: null,
            // isLoading: false
        });
        // Log the status
        const state = getState();
        const status = state.user ? 'signed-in' : 'signed-out';
        console.log(`User status: ${status}`);

        localStorage.removeItem('auth');
        dispatch(new ClearCart());
    }

    @Action(AuthSuccess)
    authSuccess({ patchState, dispatch }: StateContext<IAuthState>, { payload }: AuthSuccess) {
        console.log('AuthState.authSuccess called with payload:', payload);
        patchState({
            user: payload.user,
            token: payload.token,
            error: null,
            // isLoading: false
        });
        this.spinnerLoadingService.setLoading(false);

        if (payload.user && payload.user._id) {
            dispatch(new LoadUserCart(payload.user._id.toString()));
        } else {
            console.error('User or user ID is undefined in AuthSuccess payload');
        }
    }

    @Action(AuthFailure)
    authFailure({ patchState }: StateContext<IAuthState>, { payload }: AuthFailure) {
        console.log('AuthState.authFailure called with payload:', payload);
        patchState({
            error: payload.error,
            // isLoading: false
        });
        this.spinnerLoadingService.setLoading(false);
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

    // @Action(SetLoading)
    // setLoading({ patchState }: StateContext<IAuthState>, { payload }: SetLoading) {
    //     console.log('AuthState: Setting loading state to: ', payload);
    //     patchState({ isLoading: payload });
    // }


    // Handle this action in your AuthState
    @Action(LogCurrentState)
    logCurrentState(ctx: StateContext<IAuthState>) {
        console.log('Current AuthState:', ctx.getState());
    }

}

