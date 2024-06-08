import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppState } from '../NgRx/state/app.state';
import { setUser, clearUser } from '../NgRx/actions/auth.actions';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly userStorageKey = 'user';
  private readonly tokenStorageKey = 'token';

  constructor(private http: HttpClient, private store: Store<AppState>) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const userJson = localStorage.getItem(this.userStorageKey);
    if (userJson) {
      const user = JSON.parse(userJson);
      this.store.dispatch(setUser({ user }));
    }
  }

  getUserFromLocalStorage(): UserModel| null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }
  

  getTokenFromLocalStorage(): string | null {
    return localStorage.getItem('token');
  }

  login(credentials: any): Observable<{ user: UserModel, token: string }> {
    return this.http.post<{ user: UserModel, token: string }>('/api/login', credentials).pipe(
      map(response => {
        localStorage.setItem(this.userStorageKey, JSON.stringify(response.user));
        localStorage.setItem(this.tokenStorageKey, response.token);
        this.store.dispatch(setUser({ user: response.user }));
        return response;
      })
    );
  }

  logout() {
    localStorage.removeItem(this.userStorageKey);
    localStorage.removeItem(this.tokenStorageKey);
    this.store.dispatch(clearUser());
  }

  register(user: UserModel): Observable<{ user: UserModel, token: string }> {
    return this.http.post<{ user: UserModel, token: string }>('/api/register', user).pipe(
      map(response => {
        localStorage.setItem(this.userStorageKey, JSON.stringify(response.user));
        localStorage.setItem(this.tokenStorageKey, response.token);
        this.store.dispatch(setUser({ user: response.user }));
        return response;
      })
    );
  }
}