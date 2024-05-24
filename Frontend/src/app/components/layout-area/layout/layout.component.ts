import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserModel } from '../../../models/user.model';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { HeaderComponent } from '../../HeaderArea/header/header.component';
import { FooterComponent } from '../../FooterArea/footer/footer.component';
import { Observable } from 'rxjs';
import { selectIsLoggedIn, selectUser } from '../../../NgRx/Selectors/auth.selectors';
import { AppState } from '../../../NgRx/reducers';
import * as AuthActions from '../../../NgRx/actions/auth.actions';


@Component({
    selector: 'app-layout',
    standalone: true,
    imports: 
    //  [RouterLink, RouterModule, CommonModule, HeaderComponent, FooterComponent ],
    //   [RouterLink, RouterModule, CommonModule ],
    [HeaderComponent,FooterComponent,RouterModule,CommonModule],
        // [],  
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.module.scss']
})

export class LayoutComponent implements OnInit {
    isLoggedIn$: Observable<boolean>;
    user$: Observable<UserModel | null>;
    

    constructor(private authService: AuthService,private router: Router,  private store: Store<AppState>) { }

    ngOnInit(): void {
        this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
        this.user$ = this.authService.currentAuthStatus;
    
        this.isLoggedIn$.subscribe(status => {
          console.log('Auth status:', status); // Debug log
        });
    
        this.user$.subscribe(user => {
          console.log('Current user:', user); // Debug log
        });
      }

    logout() {
        this.store.dispatch(AuthActions.logout());
    this.router.navigate(['/']);
}


}
