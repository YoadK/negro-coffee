import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { appConfig } from '../Utils/app.config';
import { jwtDecode } from "jwt-decode";
import { CredentialsModel } from '../models/credentials.model';
import { Store } from '@ngxs/store';
import { AuthSuccess, AuthFailure, Logout } from '../NgXs/actions/auth.actions';
import { RoleModel } from '../../../../Backend/src/3-models/role-model';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
  
    private currentUserSubject: BehaviorSubject<UserModel | null>;
    public currentAuthStatus: Observable<UserModel | null>;
  
    constructor(private http: HttpClient, private store: Store) {
      console.log('AuthService constructor called');
      this.currentUserSubject = new BehaviorSubject<UserModel | null>(null);
      this.currentAuthStatus = this.currentUserSubject.asObservable();
      this.loadStoredToken();  // Ensure token is loaded when service is instantiated
    }

    loadStoredToken(): void {
      console.log('AuthService.loadStoredToken called');
      const token = localStorage.getItem('token');
      console.log('Loaded token from localStorage:', token);
      if (token) {
        try {
          const decodedToken = jwtDecode<{ user: UserModel }>(token);
          const loggedInUser = decodedToken.user;
          this.currentUserSubject.next(loggedInUser);
          console.log('Decoded and set currentAuthStatus:', loggedInUser);
          this.store.dispatch(new AuthSuccess({ user: loggedInUser, token }));
        } catch (error) {
          console.error('Invalid token:', error);
          this.currentUserSubject.next(null);
        }
      }
    }

    public geCurrentUserValue(): UserModel | null {
      console.log('AuthService.geCurrentUserValue called');
      return this.currentUserSubject.value;
    }

    register(user: UserModel): Observable<{ user: UserModel; token: string }> {
      console.log('AuthService.register called with user:', user);
      return this.http.post<{ user: UserModel; token: string }>(`${appConfig.registerUrl}`, user).pipe(
        tap(response => {
          const token = response.token;
          const registeredUser = response.user;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(registeredUser));
          this.store.dispatch(new AuthSuccess({ user: registeredUser, token: token }));
        })
      );
    }
    
    login(credentials: CredentialsModel): Observable<{ user: UserModel, token: string }> {
      console.log('AuthService.login called with credentials:', credentials);
      return this.http.post<{ user: UserModel, token: string }>(`${appConfig.loginUrl}`, credentials).pipe(
        tap(response => {
          console.log('Login API response:', response);
        }),
        map(response => {
          const token = response.token;
          if (typeof token !== 'string') {
            throw new Error('Invalid token format');
          }
          console.log('Received token:', token);
          const loggedInUser = jwtDecode<{ user: UserModel }>(token).user;
          console.log('Decoded token:', loggedInUser);
          this.currentUserSubject.next(loggedInUser);
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(loggedInUser));
          console.log('Token stored in localStorage:', token);
          console.log('User stored in localStorage:', loggedInUser);
          this.currentUserSubject.next(response.user);
          this.store.dispatch(new AuthSuccess({ user: response.user, token: response.token }));
          return { user: loggedInUser, token: token };
        }),
        catchError(err => {
          console.error('Login error:', err);
          console.error('Error details:', err.error);
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
      this.currentUserSubject.next(null);
      this.store.dispatch(new Logout());
    }

    isAuthenticated(): Observable<boolean> {
      console.log('AuthService.isAuthenticated called');
      return this.currentAuthStatus.pipe(
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
      switch (roleId) {
        case RoleModel.Admin:
          return 'Admin';
        case RoleModel.User:
          return 'User';
        default:
          return 'Unknown';
      }
    }
}