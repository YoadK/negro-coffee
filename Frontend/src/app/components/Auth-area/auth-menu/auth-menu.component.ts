import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service'; // Adjust the path as necessary
import { UserModel } from '../../../models/user.model'; // Adjust the path as necessary
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectIsLoggedIn } from '../../../NgRx/Selectors/auth.selectors';
import {AuthState} from '../../../NgRx/state/auth.state';
import { StoreModule } from '@ngrx/store';
import { authReducer } from '../../../NgRx/reducers/auth.reducer';

@Component({
  selector: 'app-auth-menu',
  standalone: true,
   imports: [RouterLink,CommonModule],
  templateUrl: './auth-menu.component.html',
  styleUrls: ['./auth-menu.component.module.scss'],
 

})
export class AuthMenuComponent implements OnInit {
  isAuthenticated: boolean = false;
  user: UserModel | null = null;
  isLoggedIn$: Observable<boolean>;
  

  constructor(
    private authService: AuthService,
    private router: Router,
     private store: Store<AuthState>
  ) {
   
  }

  ngOnInit(): void {
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);


    this.isLoggedIn$.subscribe((isLoggedIn) => {
        console.log('Is Logged In:', isLoggedIn);
      });
      
    this.authService.currentAuthStatus.subscribe(user => {
        this.isAuthenticated = !!user;
        this.user = user;
        
      });
  }



  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
