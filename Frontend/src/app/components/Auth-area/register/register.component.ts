

import { Store } from '@ngrx/store';

import { Component } from '@angular/core';
import { Register  } from '../../../NgXs/actions/auth.actions';

@Component({
    selector: 'app-register',
    // standalone: true,
    // imports: [FormsModule, CommonModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.module.scss']
})
export class RegisterComponent {
    user = { firstName: '', lastName: '', email: '', password: '' };
  error$ = this.store.select(state => state.auth.error);

  constructor(private store: Store) {}

  onSubmit() {
    this.store.dispatch(new Register(this.user));
  }
}
