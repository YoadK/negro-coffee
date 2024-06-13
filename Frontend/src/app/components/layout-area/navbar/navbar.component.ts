import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Select, Store} from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { AuthState } from '../../../NgXs/state/auth.state';
import { UserModel } from '../../../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.module.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isNavbarOpen = false;

  isLoggedIn$: Observable<boolean>;
  userRole$: Observable<string | null>;

  private unsubscribe$ = new Subject<void>();

  constructor(private store: Store) {
    this.isLoggedIn$ = this.store.select(AuthState.isAuthenticated);
    this.userRole$ = this.store.select(AuthState.user).pipe(
      map((user: UserModel | null) => user?.role || null)
    );
  }

  ngOnInit(): void {
    this.isLoggedIn$.pipe(takeUntil(this.unsubscribe$)).subscribe((isLoggedIn) => {
      console.log('Is Logged In:', isLoggedIn);
    });

    this.userRole$.pipe(takeUntil(this.unsubscribe$)).subscribe((role) => {
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}