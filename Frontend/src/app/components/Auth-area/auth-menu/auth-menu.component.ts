import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { Logout } from '../../../NgXs/actions/auth.actions';
import { Observable } from 'rxjs';
import { AuthState } from '../../../NgXs/state/auth.state';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserModel } from '../../../models/user.model';

@Component({
  selector: 'app-auth-menu',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './auth-menu.component.html',
  styleUrls: ['./auth-menu.component.module.scss']
})
export class AuthMenuComponent {
  isLoggedIn$: Observable<boolean>;
  user$: Observable<UserModel | null>;

  constructor(private store: Store) {
    this.isLoggedIn$ = this.store.select(AuthState.isAuthenticated);
    this.user$ = this.store.select(AuthState.user);
  }

  logout() {
    this.store.dispatch(new Logout());
  }
}