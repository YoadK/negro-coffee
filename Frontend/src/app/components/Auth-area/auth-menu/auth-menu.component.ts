import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { UserModel } from '../../../models/user.model';
import { CommonModule } from '@angular/common';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
// import { selectIsLoggedIn, selectUser } from '../../../NgRx/Selectors/auth.selectors';
import { AuthState } from '../../../NgRx/state/auth.state';
// import { AppState } from '../../../NgRx/reducers';
import * as AuthActions from '../../../NgRx/actions/auth.actions';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-auth-menu',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './auth-menu.component.html',
  styleUrls: ['./auth-menu.component.module.scss'],
})
export class AuthMenuComponent implements OnInit {
//   isLoggedIn$: Observable<boolean>;
//   user$: Observable<UserModel | null>;

//   constructor( private router: Router,  private authService: AuthService, private store: Store<AppState>) {
//     this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
//     this.user$ = this.store.select(selectUser);}

    ngOnInit(): void {
        // this.store.dispatch(AuthActions.loadUserFromLocalStorage());
      }

//   logout() {
//     this.authService.logout();;
//     this.router.navigate(['/']);
//   }
}