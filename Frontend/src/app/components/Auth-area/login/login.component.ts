
import { Store } from '@ngrx/store';

import { Component } from '@angular/core';

import { Login } from '../../../NgXs/actions/auth.actions';

@Component({
  selector: 'app-login',
//   standalone: true,
//   imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.module.scss']
})
export class LoginComponent {
    credentials = { email: '', password: '' };
  error$ = this.store.select(state => state.auth.error);
  
    constructor(private store: Store) {}
  
    onSubmit() {
      this.store.dispatch(new Login(this.credentials));
    }
  }
}