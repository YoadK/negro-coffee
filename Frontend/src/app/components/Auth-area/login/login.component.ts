import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Login } from '../../../NgXs/actions/auth.actions';
import { AuthState } from '../../../NgXs/state/auth.state';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { notify } from '../../../Utils/Notify';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.module.scss']
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  error$: Observable<any>;

  constructor(private store: Store,private router: Router) {
    console.log('LoginComponent constructor called');
    this.error$ = this.store.select(AuthState.error);
    this.error$.subscribe(error => {
        if (error) {
          console.error('AuthState error:', error);
        }
      });
  }

  onSubmit() {
    console.log('LoginComponent onSubmit called');
    console.log('Credentials:', this.credentials);
    this.store.dispatch(new Login(this.credentials)).subscribe(
      () => {
        console.log('Login dispatch successful');
        
        notify.success(`Welcome back!`);
        this.router.navigate(['/products']); 
      },
      error => {
        console.error('Login dispatch error:', error);
        notify.error('Login dispatch error');
      }
    );
  }
}