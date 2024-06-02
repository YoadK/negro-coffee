import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserModel } from '../../../models/user.model';
import { CommonModule } from '@angular/common';
import { Store, select } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { AppState } from '../../../NgRx/state/app.states';
import * as AuthActions from '../../../NgRx/actions/auth.actions';
import { selectIsLoggedIn, selectUser } from '../../../NgRx/Selectors/auth.selectors';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-auth-menu',
    standalone: true,
  imports: [FormsModule, CommonModule,RouterLink],
    templateUrl: './auth-menu.component.html',
    styleUrls: ['./auth-menu.component.module.scss']
  })
  export class AuthMenuComponent implements OnInit {
    isLoggedIn$: Observable<boolean>;
    user$: Observable<any>;

    errorMessage$: Observable<string | null>;
    successMessage$: Observable<string | null>;
  
    constructor(private authService: AuthService, private store: Store<AppState>) { }
  
    ngOnInit() {
        this.isLoggedIn$ = this.store.select(selectIsLoggedIn).pipe(
            tap(isLoggedIn => console.log('isLoggedIn:', isLoggedIn))
          );
          this.user$ = this.store.select(selectUser).pipe(
            tap(user => console.log('user:', user))
          );

      this.errorMessage$ = this.store.select(state => state.auth.errorMessage);
    this.successMessage$ = this.store.select(state => state.auth.successMessage);
    }
  
    logout() {
        this.authService.logout();
  this.authService.removeToken();
    }
  }