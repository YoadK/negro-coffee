import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StatusCode } from '../../../../Backend/src/3-models/enums';
import { AuthService } from '../services/auth.service';
import { SpinnerLoadingService } from '../services/spinner.loading.service';
import { Notyf } from "notyf";
import {notify} from '../Utils/Notify';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestsInterceptor implements HttpInterceptor {
  private totalRequests = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private spinnerLoadingService: SpinnerLoadingService
  ) {
    console.log("HttpRequestsInterceptor constructor called");
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.totalRequests++;
    this.spinnerLoadingService.setLoading(true);
    console.log('Setting loading to true');

    const token = this.authService.loadStoredToken();
    let authRequest = token ? request.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    }) : request;

    return timer(300).pipe(
      switchMap(() => next.handle(authRequest)),
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
        // console.log(`Response for ${event.url} with status ${event.status}`);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      }),
      finalize(() => {
        this.totalRequests--;
        // console.log('Request finished. Total requests:', this.totalRequests);
        if (this.totalRequests === 0) {
        //   console.log('Setting loading to false');
          this.spinnerLoadingService.setLoading(false);
        }
      })
    );
  }

  private handleError(error: HttpErrorResponse): void {
    let errorMessage = 'An unknown error occurred!';
    let userFriendlyMessage = 'Something went wrong. Please try again later.';
  
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Client-side error: ${error.error.message}`;
      console.error(errorMessage);
    } else {
      // Backend returned an unsuccessful response code
      switch (error.status) {
        case 0:
          errorMessage = 'Unable to connect to the server. Please check your internet connection.';
          break;
        case StatusCode.BadRequest:
          errorMessage = `Bad Request: ${error.error.message || error.error}`;
          userFriendlyMessage = 'The request was invalid. Please check your input and try again.';
          break;
        case StatusCode.Unauthorized:
          errorMessage = 'Unauthorized access';
          userFriendlyMessage = 'Your session has expired. Please log in again.';
          this.router.navigate(['/login']);
          break;
        case StatusCode.Forbidden:
          errorMessage = 'Access denied';
          userFriendlyMessage = 'You do not have permission to perform this action.';
          break;
        case StatusCode.NotFound:
          errorMessage = 'Resource not found';
          userFriendlyMessage = 'The requested information could not be found.';
          break;
        case StatusCode.InternalServerError:
          errorMessage = 'Internal Server Error';
          userFriendlyMessage = 'An unexpected error occurred on the server. Please try again later.';
          break;
        default:
          errorMessage = `Backend returned code ${error.status}, body was: ${error.error}`;
      }
      
      console.error(errorMessage);
    }
  
    // You can integrate this with a notification service to show user-friendly messages
    notify.error(userFriendlyMessage);
  
    // Optionally, you can log errors to a central error logging service
    // notify.error(errorMessage);
  }
}