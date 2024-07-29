import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthState } from '../../../NgXs/state/auth.state';
import { UserModel } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { ProductsManagementComponent } from '../../products-area/products-management/products-management.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, ProductsManagementComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.module.scss']
})
export class NavbarComponent {
  isNavbarOpen = false;
  isLoggedIn$: Observable<boolean>;
  userRole$: Observable<string | null>;

  constructor(private store: Store, private authService: AuthService) {
    this.isLoggedIn$ = this.store.select(AuthState.isAuthenticated);
    this.userRole$ = this.store.select(AuthState.user).pipe(
      map((user: UserModel | null) => user ? this.authService.getRoleNameFromRoleId(user.roleId) : null)
    );

    this.isLoggedIn$.pipe(takeUntilDestroyed()).subscribe((isLoggedIn) => {
      console.log('Is Logged In:', isLoggedIn);
    });

    this.userRole$.pipe(takeUntilDestroyed()).subscribe((role) => {
      console.log('User Role:', role);
    });
  }

  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

  isSmallScreen(): boolean {
    return window.innerWidth < 768;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (!this.isSmallScreen()) {
      this.isNavbarOpen = false;
    }
  }
}