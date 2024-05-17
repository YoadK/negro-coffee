import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUserModel } from '../../app/models/user.model';
import { ICredentialsModel } from '../models/credentials.model';
import { appConfig } from '../app.config';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://your-api-url.com';

  constructor(private http: HttpClient) {}

  register(credentials: ICredentialsModel): Observable<IUserModel> {
    return this.http.post<IUserModel>(`${appConfig.registerUrl}`, credentials);
  }

  login(credentials: ICredentialsModel): Observable<IUserModel> {
    return this.http.post<IUserModel>(`${appConfig.loginUrl}`, credentials);
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {});
  }
}
