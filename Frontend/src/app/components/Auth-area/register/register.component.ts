import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { notify } from '../../../Utils/Notify';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserModel } from '../../../models/user.model';


@Component({
  selector: 'app-register',
  standalone: true,
    imports:  [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.module.scss']
})
export class RegisterComponent {
    
    public user: UserModel = new UserModel(); // Instantiate using the new keyword

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onSubmit() {
    // Client-side validation
    if (this.user.firstName.length < 1 || this.user.firstName.length > 50) {
      notify.error('First name must be between 1 and 50 characters long.');
      return;
    }
    if (this.user.lastName.length < 1 || this.user.lastName.length > 50) {
      notify.error('Last name must be between 1 and 50 characters long.');
      return;
    }

    try {
      await this.authService.register(this.user);
      notify.success(`Welcome ${this.user.firstName}!`);
      this.router.navigate(['/home']);
    } catch (error:any) {
      notify.error(error.message || 'Registration failed');
    }
  }
}
