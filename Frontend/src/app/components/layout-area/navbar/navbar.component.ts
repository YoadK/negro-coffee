import { CommonModule } from '@angular/common';
import { Component, HostListener, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
// import { AppState } from '../../../NgRx/reducers';
import { takeUntil } from 'rxjs/operators';
// import { selectUserRole, selectIsLoggedIn } from '../../../NgRx/Selectors/auth.selectors';


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

//   constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    // this.userRole$ = this.store.select(selectUserRole);
    // this.isLoggedIn$ = this.store.select(selectIsLoggedIn);

    if (this.userRole$) {
      this.userRole$.pipe(takeUntil(this.unsubscribe$)).subscribe(role => {
        console.log('User Role:', role);
      });
    }

    if (this.isLoggedIn$) {
      this.isLoggedIn$.pipe(takeUntil(this.unsubscribe$)).subscribe((isLoggedIn) => {
        console.log('Is Logged In:', isLoggedIn);
      });
    }
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