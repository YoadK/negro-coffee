import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { UserModel } from '../../../models/user.model';
import { CommonModule } from '@angular/common';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectIsLoggedIn, selectUser } from '../../../NgXs/Selectors/auth.selectors';
import { AuthState } from '../../../NgXs/state/auth.state';
import { AppState } from '../../../NgXs/reducers';
import * as AuthActions from '../../../NgXs/actions/auth.actions';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-auth-menu',
//   standalone: true,
//   imports: [RouterLink, CommonModule],
  templateUrl: './auth-menu.component.html',
  styleUrls: ['./auth-menu.component.module.scss'],
})
export class AuthMenuComponent {
    isLoggedIn$ = this.store.select(state => state.auth.token != null);
    user$ = this.store.select(state => state.auth.user);
  
    constructor(private store: Store) {}
  
    logout() {
      this.store.dispatch(new Logout());
    }
  }