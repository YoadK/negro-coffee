

import { Store } from '@ngxs/store';

import { Component } from '@angular/core';
import { Register  } from '../../../NgXs/actions/auth.actions';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-register',
     standalone: true,
     imports: [FormsModule, CommonModule],
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
