import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Login } from '../../../NgXs/actions/auth.actions';
import { AuthState } from '../../../NgXs/state/auth.state';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


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

  constructor(private store: Store) {
    this.error$ = this.store.select(AuthState.error);
  }

  onSubmit() {
    this.store.dispatch(new Login(this.credentials));
  }
}
