import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserModel } from '../../../models/user.model';
import { CommonModule } from '@angular/common';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectIsLoggedIn, selectUser } from '../../../NgRx/Selectors/auth.selectors';
import { AuthState } from '../../../NgRx/state/auth.state';
import { AppState } from '../../../NgRx/reducers';
import * as AuthActions from '../../../NgRx/actions/auth.actions';


@Component({
  selector: 'app-auth-menu',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './auth-menu.component.html',
  styleUrls: ['./auth-menu.component.module.scss'],
})
export class AuthMenuComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;
  user$: Observable<UserModel | null>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
    this.user$ = this.authService.currentAuthStatus;
   
    this.isLoggedIn$.subscribe((isLoggedIn) => {
      console.log('Is Logged In:', isLoggedIn);
    });

    this.user$.subscribe((user) => {
        console.log('Current User:', user);
      });
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
    this.router.navigate(['/']);
  }
}