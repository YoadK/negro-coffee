import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserModel } from '../../../models/user.model';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { HeaderComponent } from '../../HeaderArea/header/header.component';
import { FooterComponent } from '../../FooterArea/footer/footer.component';
import { Observable } from 'rxjs';
import { selectIsLoggedIn, selectUser } from '../../../NgXs/Selectors/auth.selectors';
import { AppState } from '../../../NgXs/reducers';
import * as AuthActions from '../../../NgXs/actions/auth.actions';


@Component({
    selector: 'app-layout',
    standalone: true,
    imports:
        //  [RouterLink, RouterModule, CommonModule, HeaderComponent, FooterComponent ],
        //   [RouterLink, RouterModule, CommonModule ],
        [HeaderComponent, FooterComponent, RouterModule, CommonModule],
    // [],  
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
            console.log('Current user (layout):', user); // Debug log
        });
    }

    logout() {
        this.store.dispatch(AuthActions.logout());
        this.router.navigate(['/']);
    }


}
