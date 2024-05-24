import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { appConfig } from '../Utils/app.config';
import { jwtDecode } from "jwt-decode";
import { CredentialsModel } from '../models/credentials.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
  
    private currentUserSubject: BehaviorSubject<UserModel | null>;
    public currentAuthStatus: Observable<UserModel | null>;

    constructor(private http: HttpClient) {
        const storedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
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

   

    public get currentUserValue(): UserModel | null {
        return this.currentUserSubject.value;
      }

    register(user: UserModel): Observable<UserModel> {
        return this.http.post<string>(`${appConfig.registerUrl}`, user).pipe(
            map(token => {
                const registeredUser = jwtDecode<{ user: UserModel }>(token).user;
                this.currentUserSubject.next(registeredUser);
                localStorage.setItem('token', token);
                return registeredUser;
            })
        );
    }

    login(credentials: CredentialsModel): Observable<UserModel> {
        console.log('Login method called with credentials:', credentials); // Log to ensure login method is called
        
        return this.http.post<any>(`${appConfig.loginUrl}`, credentials).pipe(
            tap(response => {
                console.log('Login API response:', response); // Log the API response
            }),
            map(response => {
                const token = response.token; // Ensure response contains token
                if (typeof token !== 'string') {
                    throw new Error('Invalid token format');
                }
                console.log('Received token:', token); // Log the received token
                const loggedInUser = jwtDecode<{ user: UserModel }>(token).user;
                console.log('Decoded token:', loggedInUser); // Log the decoded token
                this.currentUserSubject.next(loggedInUser);
                localStorage.setItem('token', token);
                console.log('Token stored in localStorage:', token); // Log the stored token
                return loggedInUser;
            }),
            catchError(err => {
                console.error('Login error:', err); // Log any errors that occur
                console.error('Error details:', err.error); // Log detailed error information
                return throwError(err);
            })
        );
    }

    logout(): void {
      
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
    }

    isAuthenticated(): Observable<boolean> {
        
        return this.currentAuthStatus.pipe(
            map(user => !!user)
        );
    }
}