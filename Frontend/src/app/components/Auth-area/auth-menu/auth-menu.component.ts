import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { Logout } from '../../../NgXs/actions/auth.actions';
import { Observable } from 'rxjs';
import { AuthState } from '../../../NgXs/state/auth.state';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserModel } from '../../../models/user.model';
import { map } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { ToggleCartModal } from '../../../NgXs/actions/cart.actions';
import { ShoppingCartModalComponent } from '../../Modals/shopping-cart-modal/shopping.cart.modal.component';


@Component({
  selector: 'app-auth-menu',
  standalone: true,
  imports: [RouterLink,  CommonModule, ShoppingCartModalComponent],
  templateUrl: './auth-menu.component.html',
  styleUrls: ['./auth-menu.component.module.scss']
})
export class AuthMenuComponent {
  isLoggedIn$: Observable<boolean>;
  user$: Observable<UserModel | null>;
  userRole$: Observable<string | null>;
  isCartModalOpen = false; 


  constructor(private store: Store,  private authService: AuthService) {
    this.isLoggedIn$ = this.store.select(AuthState.isAuthenticated);
    this.user$ = this.store.select(AuthState.user);
    this.userRole$ = this.user$.pipe(
        map(user => user ? this.authService.getRoleNameFromRoleId(user.roleId) : null)
      );
  }

  ngOnInit(): void {
    this.userRole$.subscribe(role => {
      console.log('User Role:', role);
    });
  }

  toggleCartModal() {
    console.log('toggleCartModal called');
    this.store.dispatch(new ToggleCartModal());
  }


  logout() {
    console.log('AuthMenuComponent.logout called');
    this.store.dispatch(new Logout());
  }
}