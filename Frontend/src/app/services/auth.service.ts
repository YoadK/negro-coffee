import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { appConfig } from '../Utils/app.config';
import { Store } from '@ngrx/store';
import { AppState } from '../NgRx/state/app.states';
import * as AuthActions from '../NgRx/actions/auth.actions';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private userSubject = new BehaviorSubject<UserModel | null>(null);
  user$ = this.userSubject.asObservable();

  private token: string | null = null;

  constructor(private http: HttpClient, private store: Store<AppState>) {
    // Check if a token exists in local storage
    this.token = localStorage.getItem('token');
    if (this.token) {
      this.isLoggedInSubject.next(true);
      const user = this.decodeToken(this.token);
      this.userSubject.next(user);
    }
  }

  getToken(): string {
    return this.token!;
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  removeToken(): void {
    this.token = null;
    localStorage.removeItem('token');
  }

  login(email: string, password: string): Observable<UserModel> {
    const url = `${appConfig.loginUrl}`;
    return this.http.post<UserModel>(url, { email, password }).pipe(
      map(user => {
        // Update the subjects with the new user data
        this.userSubject.next(user);
        this.isLoggedInSubject.next(true);
        // Store the token in local storage
        localStorage.setItem('token', user.token);
        this.setToken(user.token);
        return user;
      })
    );
  }

  register(email: string, password: string): Observable<UserModel> {
    const url = `${appConfig.registerUrl}`;
    return this.http.post<UserModel>(url, { email, password }).pipe(
      map(user => {
        return {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
          roleId: user.roleId,
          token: user.token
        };
      })
    );
  }

  getStatus(): Observable<UserModel> {
    const url = `${appConfig.statusUrl}`;
    return this.http.get<UserModel>(url);
  }

  logout() {
    // Clear the subjects and local storage
    this.userSubject.next(null);
    this.isLoggedInSubject.next(false);
    this.removeToken();
    localStorage.removeItem('token');

    // Dispatch a logout action
    this.store.dispatch(AuthActions.Logout());
  }

  private decodeToken(token: string): UserModel {
    try {
      const decoded: any = jwt_decode(token);
      return {
        _id: decoded._id,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        email: decoded.email,
        roleId: decoded.roleId,
        token: token
      };
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }
}
