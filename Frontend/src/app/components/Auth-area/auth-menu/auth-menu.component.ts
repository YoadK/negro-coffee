import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Logout } from '../../../NgXs/actions/auth.actions';
import { Observable } from 'rxjs';
import { AuthState } from '../../../NgXs/state/auth.state';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserModel } from '../../../models/user.model';
import { map,take } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { ToggleCartModal } from '../../../NgXs/actions/cart.actions';
import { ShoppingCartModalComponent } from '../../Modals/shopping-cart-modal/shopping-cart-modal.component';
import { CartState} from '../../../NgXs/state/cart.state';
import { ProductModel } from '../../../models/product.model';
import { ClearCart } from '../../../NgXs/actions/cart.actions';
import { MyAccountComponent } from '../../my-account-area/my-account/my-account.component';
import { notify } from '../../../Utils/Notify';
import { Router } from '@angular/router';


@Component({
  selector: 'app-auth-menu',
  standalone: true,
  imports: [RouterLink, CommonModule, ShoppingCartModalComponent],
  templateUrl: './auth-menu.component.html',
  styleUrls: ['./auth-menu.component.module.scss']
})

export class AuthMenuComponent {
  isLoggedIn$: Observable<boolean>;
  user$: Observable<UserModel | null>;
  userRole$: Observable<string | null>;
  isCartModalOpen = false; 
  @Select(CartState.isCartModalOpen) isCartModalOpen$: Observable<boolean>;
  @Select(CartState.cartItems) cartItems$: Observable<Array<ProductModel & { quantity: number }>>;
  totalCartItems: number = 0;
 

 

  constructor(private store: Store,  private authService: AuthService,private router: Router) {
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
    this.cartItems$.subscribe(items => {
        this.totalCartItems = items.reduce((sum, item) => sum + item.quantity, 0);
      });
  }

  toggleCartModal() {
    console.log('toggleCartModal called');
    this.store.dispatch(new ToggleCartModal());
  }


  logout() {
    console.log('AuthMenuComponent.logout called');
    this.authService.logout().pipe(take(1)).subscribe({
        next: () => {
            this.store.dispatch(new ClearCart());
            this.router.navigate(['/']);
            notify.success('You have been logged out.');
            // Force update of authentication status
            //this.isLoggedIn$ = this.store.select(AuthState.isAuthenticated);
            //this.user$ = this.store.select(AuthState.user);
        },
        error: (err: any) => {
            console.error('Logout error:', err);
            notify.error('An error occurred during logout. Please try again.');
        }
    });
}




 

}