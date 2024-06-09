import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthSelectors } from '../../../NgXs/Selectors/auth.selectors';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.module.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isNavbarOpen = false;

  @Select(AuthSelectors.isLoggedIn) isLoggedIn$: Observable<boolean>;
  @Select(AuthSelectors.userRole) userRole$: Observable<string | null>;

  private unsubscribe$ = new Subject<void>();

  constructor(private store: Store) {}

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