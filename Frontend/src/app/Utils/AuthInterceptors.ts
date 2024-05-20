import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StatusCode } from '../../../../Backend/src/3-models/enums';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authService: AuthService) {
    console.log("AuthInterceptor constructor called");
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('AuthInterceptor: Intercepting request', request);
    const token = this.authService.loadStoredToken();
    console.log('Retrieved token from localStorage:', token); // Debugging

    if (token) {
      console.log('AuthInterceptor: Adding token to Authorization header');
      const authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
   
      console.log('Added Authorization header:', authRequest.headers); // Debugging
      
      return next.handle(authRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          switch (error.status) {
            case StatusCode.Unauthorized:
              // Handle unauthorized error
              this.router.navigate(['/login']);
              break;
            case StatusCode.Forbidden:
              // Handle forbidden error
              console.error('Access denied');
              break;
            // Handle other status codes as needed
            default:
              break;
          }
          return throwError(error);
        })
      );
    } else {
      // Token is not present, proceed with the original request
      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          switch (error.status) {
            case StatusCode.Unauthorized:
              // Handle unauthorized error
              this.router.navigate(['/login']);
              break;
            case StatusCode.Forbidden:
              // Handle forbidden error
              console.error('Access denied');
              break;
            // Handle other status codes as needed
            default:
              break;
          }
          return throwError(error);
        })
      );
    }
  }
}