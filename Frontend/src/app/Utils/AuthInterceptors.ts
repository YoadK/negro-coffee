import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StatusCode } from '../../../../Backend/src/3-models/enums';
import { AuthService } from '../services/auth.service';
import { SpinnerLoadingService } from '../services/spinner.loading.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  private totalRequests = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private spinnerLoadingService: SpinnerLoadingService
  ) {
    console.log("AuthInterceptor constructor called");
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.totalRequests++;
    this.spinnerLoadingService.setLoading(true);
    console.log('Setting loading to true');

    const token = this.authService.loadStoredToken();
    let authRequest = token ? request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    }) : request;

    return timer(3000).pipe(
      switchMap(() => next.handle(authRequest)),
      catchError((error: HttpErrorResponse) => {
        if (error.status === StatusCode.Unauthorized) {
          this.router.navigate(['/login']);
        } else if (error.status === StatusCode.Forbidden) {
          console.error('Access denied');
        }
        return throwError(() => error);
      }),
      finalize(() => {
        this.totalRequests--;
        console.log('Request finished. Total requests:', this.totalRequests);
        if (this.totalRequests === 0) {
          console.log('Setting loading to false');
          this.spinnerLoadingService.setLoading(false);
        }
      })
    );
  }
}