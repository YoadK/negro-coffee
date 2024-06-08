import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { appConfig } from '../Utils/app.config';
import { jwtDecode } from "jwt-decode";
import { CredentialsModel } from '../models/credentials.model';
import { Store } from '@ngrx/store';
import * as AuthActions from '../NgXs/actions/auth.actions';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
  
    private currentUserSubject: BehaviorSubject<UserModel | null>;
    public currentAuthStatus: Observable<UserModel | null>;

    constructor(private http: HttpClient, private store: Store) {

    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    console.log("stored user is: "+storedUser);
    this.currentUserSubject = new BehaviorSubject<UserModel | null>(storedUser);
    this.currentAuthStatus = this.currentUserSubject.asObservable();
    }

    // loads the token and updates the currentAuthStatus. returns token.
     loadStoredToken(): string | null {
        const token = localStorage.getItem('token');
        console.log('Loaded token from localStorage:', token); // Log the loaded token
        if (token) {
            try {
                const decodedToken = jwtDecode<{ user: UserModel }>(token);
                const loggedInUser = decodedToken.user;
                this.currentUserSubject.next(loggedInUser);
                console.log('Decoded and set currentAuthStatus:', loggedInUser); // Log the decoded user
                return token;
            } catch (error) {
                console.error('Invalid token:', error);
                this.currentUserSubject.next(null);
            }
        }
        return null;
    }

   

    public geCurrentUserValue(): UserModel | null {
        return this.currentUserSubject.value;
      }

    register(user: UserModel): Observable<{ user: UserModel; token: string }> {
    return this.http.post<{ user: UserModel; token: string }>(`${appConfig.registerUrl}`, user).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
        this.store.dispatch(AuthActions.registerSuccess({ user: response.user, token: response.token }));
      })
    );
  }

    login(credentials: CredentialsModel): Observable<{ user: UserModel, token: string }> {
        console.log('Login method called with credentials:', credentials);
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
            this.store.dispatch(AuthActions.loginSuccess({ user: response.user, token: response.token }));
            return { user: loggedInUser, token: token }; // Return an object with user and token properties
          }),
          catchError(err => {
            console.error('Login error:', err);
            console.error('Error details:', err.error);
            return throwError(err);
          })
        );
      }

    logout(): void {
        console.log('Logout method called');
        localStorage.removeItem('token');
        localStorage.removeItem('user'); // Remove user object from local storage
        console.log('Token and user removed from localStorage');
        this.currentUserSubject.next(null);
        this.store.dispatch(AuthActions.logoutSuccess());
    }

    isAuthenticated(): Observable<boolean> {
        
        return this.currentAuthStatus.pipe(
            map(user => !!user)
        );
    }


    getUserFromLocalStorage(): UserModel | null {
        const userJson = localStorage.getItem('user');
   
        console.log('User retrieved from localStorage:', userJson);

        return userJson ? JSON.parse(userJson) : null;
      }
    
      getTokenFromLocalStorage(): string | null {
        const token = localStorage.getItem('token');
        console.log('Token retrieved from localStorage:', token);

        return token;
      }
    }
