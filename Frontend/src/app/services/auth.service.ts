import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { appConfig } from '../Utils/app.config';
import { jwtDecode } from "jwt-decode";
import { CredentialsModel } from '../models/credentials.model';
import { Store, Select } from '@ngxs/store';
import { AuthSuccess, AuthFailure, Logout } from '../NgXs/actions/auth.actions';
import { RoleModel } from '../../../../Backend/src/3-models/role-model';
import { AuthState } from '../NgXs/state/auth.state';
import { SpinnerLoadingService } from './spinner.loading.service';
import { finalize } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private currentUser$: Observable<UserModel | null>;


    constructor(private http: HttpClient, private store: Store,private spinnerLoadingService: SpinnerLoadingService) {
        console.log('AuthService constructor called');
        this.currentUser$ = this.store.select(AuthState.user);
        this.loadStoredToken();  // Ensure token is loaded when service is instantiated
    }

    loadStoredToken(): string | null {
        this.spinnerLoadingService.setLoading(true);

        console.log('AuthService.loadStoredToken called');
        const token:string | null = localStorage.getItem('token')?.toString();
        console.log('Loaded token from localStorage:', token);
        if (token) {
            try {
                const decodedToken = jwtDecode<{ user: UserModel }>(token);
                const loggedInUser = decodedToken.user;
                console.log('Decoded and dispatching AuthSuccess:', loggedInUser);
                this.store.dispatch(new AuthSuccess({ user: loggedInUser, token }));
            } catch (error) {
                console.error('Invalid token:', error);
                this.store.dispatch(new Logout());
            }
        }
        this.spinnerLoadingService.setLoading(false);

        return token
    }

    public getCurrentUserValue(): UserModel | null {
        console.log('AuthService.getCurrentUserValue called');
        let currentUser: UserModel | null = null;
        this.currentUser$.subscribe(user => currentUser = user);
        return currentUser;
    }

    login(credentials: CredentialsModel): Observable<{ user: UserModel, token: string }> {
        this.spinnerLoadingService.setLoading(true);
    
        return this.http.post<{ user: UserModel, token: string }>(`${appConfig.loginUrl}`, credentials).pipe(
            tap(response => {
                if (response && response.user && response.token) {
                    const token = response.token;
                    const loggedInUser = response.user;
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(loggedInUser));
                    console.log('Token stored in localStorage:', token);
                    console.log('User stored in localStorage:', loggedInUser);
                    this.store.dispatch(new AuthSuccess({ user: response.user, token: response.token }));
                } else {
                    throw new Error('Invalid response structure');
                }
            }),
            catchError(err => {
                console.error('Login error:', err);
                this.store.dispatch(new AuthFailure({ error: err.error }));
                return throwError(() => err);
            }),
            finalize(() => {
                console.log('Login finalized, setting loading to false');
                this.spinnerLoadingService.setLoading(false);
            })
        );
    }

    register(credentials: CredentialsModel): Observable<{ user: UserModel, token: string }> {
        this.spinnerLoadingService.setLoading(true);
        return this.http.post<{ user: UserModel, token: string }>(`${appConfig.registerUrl}`, credentials).pipe(
            tap(response => {
                try {
                    if (response && response.user && response.token) {  // <-- Check response structure
                        const token = response.token;
                        const loggedInUser = response.user;
                        localStorage.setItem('token', token);
                        localStorage.setItem('user', JSON.stringify(loggedInUser));
                        console.log('Token stored in localStorage:', token);
                        console.log('User stored in localStorage:', loggedInUser);
                        this.store.dispatch(new AuthSuccess({ user: response.user, token: response.token }));
                    } else {
                        throw new Error('Invalid response structure');  // <-- Handle invalid response
                    }
                } catch (error) {
                    console.error('Register error:', error);
                    throw error;
                }

                finalize (()=> this.spinnerLoadingService.setLoading(false))  

            }),
            catchError(err => {
                console.error('Register error:', err);
                this.store.dispatch(new AuthFailure({ error: err.error }));
                return throwError(err);
            })
        );
    }

    logout(): void {
        console.log('AuthService.logout called');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        console.log('Token and user removed from localStorage');
        this.store.dispatch(new Logout());
    }

    isAuthenticated(): Observable<boolean> {
        console.log('AuthService.isAuthenticated called');
        return this.currentUser$.pipe(
            map(user => !!user)
        );
    }

    getUserFromLocalStorage(): UserModel | null {
        console.log('AuthService.getUserFromLocalStorage called');
        const userJson = localStorage.getItem('user');
        console.log('User retrieved from localStorage:', userJson);
        return userJson ? JSON.parse(userJson) : null;
    }

    getTokenFromLocalStorage(): string | null {
        console.log('AuthService.getTokenFromLocalStorage called');
        const token = localStorage.getItem('token');
        console.log('Token retrieved from localStorage:', token);
        return token;
    }

    getRoleNameFromRoleId(roleId: number): string {
        console.log('AuthService.getRoleNameFromRoleId called with roleId:', roleId);
        return roleId in RoleModel ? RoleModel[roleId] : 'Unknown';
    }
}
