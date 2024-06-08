import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserModel } from '../../../models/user.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectIsLoggedIn, selectUser } from '../../../NgRx/Selectors/auth.selectors';
import { AppState } from '../../../NgRx/reducers';
import * as AuthActions from '../../../NgRx/actions/auth.actions';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.module.scss']
})
export class LayoutComponent implements OnInit {
    isLoggedIn$: Observable<boolean>;
    user$: Observable<UserModel | null>;

    constructor(private authService: AuthService, private router: Router, private store: Store<AppState>) { }

    ngOnInit(): void {
        this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
        this.user$ = this.store.select(selectUser);

        this.isLoggedIn$.subscribe((isLoggedIn) => {
            console.log('Is Logged In:', isLoggedIn);
        });

        this.user$.subscribe(user => {
            console.log('Current user (layout):', user);
        });
    }

    logout() {
        this.store.dispatch(AuthActions.logout());
        this.router.navigate(['/']);
    }
}