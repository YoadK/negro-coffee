import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CredentialsModel } from '../../../models/credentials.model';
import { notify } from '../../../Utils/Notify';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { UserModel } from '../../../models/user.model';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../NgRx/actions/auth.actions';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.module.scss']
})
export class LoginComponent implements OnDestroy{
  credentials: CredentialsModel = { email: '', password: '' };
  private unsubscribe$ = new Subject<void>();

  constructor(private authService: AuthService, private router: Router, private store: Store) {}
    

  onSubmit() {
    console.log('------------------------------------------------------------------------');
    console.log('Login button clicked');
    this.authService.login(this.credentials).pipe(takeUntil(this.unsubscribe$)).subscribe(
      (response: { user: UserModel, token: string }) => {
        const { user, token } = response;
        console.log('Login successful, current user:', user);
        notify.success(`Welcome back ${user.firstName}!`);
        this.store.dispatch(AuthActions.loginSuccess({ user, token }));
        this.router.navigate(['/home']);
      },
      (err: any) => {
        console.error('Login failed:', err);
        console.error('Error details:', err.error);
        notify.error(err.message || 'Login failed');
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
}

}