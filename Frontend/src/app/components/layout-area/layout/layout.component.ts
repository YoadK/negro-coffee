import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthState } from '../../../NgXs/state/auth.state';
import { Logout } from '../../../NgXs/actions/auth.actions';
import { HeaderComponent } from '../../HeaderArea/header/header.component';
import { FooterComponent } from '../../FooterArea/footer/footer.component';
import { UserModel } from '../../../models/user.model';
import { SpinnerComponent } from '../../SharedArea/spinner/spinner.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterModule,SpinnerComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.module.scss'],
})
export class LayoutComponent {
  isLoggedIn$: Observable<boolean>;
  user$: Observable<UserModel | null>;

  constructor(private store: Store, private router: Router) {
    this.isLoggedIn$ = this.store.select(AuthState.isAuthenticated);
    this.user$ = this.store.select(AuthState.user);
  }

  logout() {
    this.store.dispatch(new Logout());
    this.router.navigate(['/']);
  }
}