//guarding routes based on authentication status

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import {notify} from '../../Utils/Notify';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthState } from '../../NgXs/state/auth.state';
import { Store } from '@ngxs/store';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private store: Store,
    
    private router: Router,
   
  ) {}
  canActivate(): Observable<boolean> {
    return this.store.select(AuthState.isAuthenticated).pipe(
      map(isAuthenticated => {
        if (!isAuthenticated) {
          notify.error('You must sign in to access your account details.');
          this.router.navigate(['/login']);
        }
        return isAuthenticated;
      })
    );
  }
}
