import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { appConfig } from '../Utils/app.config';

export interface CredentialsModel {
  email: string;
  password: string;
}

export interface UserModel {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  // Add other user properties as needed
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  private currentUser: UserModel | null = null;

  constructor(private http: HttpClient) {}

  register(user: UserModel): Promise<UserModel> {
    return this.http.post<UserModel>(`${appConfig.registerUrl}`, user)
      .pipe(
        map(response => response),
        catchError(error => throwError(error))
      ).toPromise();
  }

  login(credentials: CredentialsModel): Promise<UserModel> {
    return this.http.post<UserModel>(`${appConfig.loginUrl}`, credentials)
      .pipe(
        tap(user => this.currentUser = user),
        catchError(error => throwError(error))
      ).toPromise();
  }

  getCurrentUser(): UserModel | null {
    return this.currentUser;
  }
}
