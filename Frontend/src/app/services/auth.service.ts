import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { appConfig } from '../Utils/app.config';
import {UserModel} from '../../../../Frontend/src/app/models/user.model';
import {CredentialsModel} from '../../../../Frontend/src/app/models/credentials.model';


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
