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
    public currentAuthStatus = new BehaviorSubject<UserModel | null>(null);

    constructor(private http: HttpClient) {
        const token =this.getToken ();
        if (token) { 
            const loggedInUser = jwtDecode<{ user: UserModel }>(token).user;
            this.currentAuthStatus.next(loggedInUser);
        }
    }

    getToken(): string | null {
        return sessionStorage.getItem('token');
      }

    getCurrentUser(): UserModel | null {
        return this.currentAuthStatus.value;
    }

    register(user: UserModel): Observable<UserModel> {
        return this.http.post<string>(`${appConfig.registerUrl}`, user).pipe(
            map(token => {
                const registeredUser = jwtDecode<{ user: UserModel }>(token).user;
                this.currentAuthStatus.next(registeredUser);
                sessionStorage.setItem('token', token);
                return registeredUser;
            })
        );
    }

    login(credentials: CredentialsModel): Observable<UserModel> {
        console.log('Login method called with credentials:', credentials); // Log to ensure login method is called
        
        return this.http.post<any>(`${appConfig.loginUrl}`, credentials).pipe(
            tap(response => {
                console.log('Login response:', response); // Log the API response
            }),
            map(response => {
                const token = response.token; // Ensure response contains token
                if (typeof token !== 'string') {
                    throw new Error('Invalid token format');
                }
                console.log('Received token:', token); // Log the received token
                const loggedInUser = jwtDecode<{ user: UserModel }>(token).user;
                console.log('Decoded token:', loggedInUser); // Log the decoded token
                this.currentAuthStatus.next(loggedInUser);
                sessionStorage.setItem('token', token);
                console.log('Token stored in sessionStorage:', token); // Log the stored token
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
        this.currentAuthStatus.next(null);
        sessionStorage.removeItem('token');
    }

    isAuthenticated(): Observable<boolean> {
        debugger
        return this.currentAuthStatus.asObservable().pipe(
            map(user => !!user)
        );
    }
}