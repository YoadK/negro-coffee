

import { Store } from '@ngxs/store';

import { Component } from '@angular/core';
import { Register  } from '../../../NgXs/actions/auth.actions';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserModel } from '../../../models/user.model';
import {RoleModel} from '.../../../../Backend/src/3-models/role-model';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-register',
     standalone: true,
     imports: [FormsModule, CommonModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.module.scss']
})
export class RegisterComponent {
    user: UserModel = {        
        roleId: 2,
        role:'',
        firstName: '',
        lastName: '',
        email: '',
        password: ''
      };
  error$ = this.store.select(state => state.auth.error);

  
  constructor(private store: Store, private authService: AuthService) {
    this.user.role = this.authService.getRoleFromRoleId(this.user.roleId);
  }

  onSubmit() {
    this.store.dispatch(new Register(this.user));
  }
}
