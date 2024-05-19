import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CredentialsModel } from '../../../models/credentials.model';
import { notify } from '../../../Utils/Notify';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { UserModel } from '../../../models/user.model';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.module.scss']
})
export class LoginComponent {
    credentials: CredentialsModel = { email: '', password: '' };

    constructor(private authService: AuthService, private router: Router) {}

    onSubmit() {
        
        console.log('Login button clicked'); // Log to confirm method is called
        this.authService.login(this.credentials).subscribe(
            (user: UserModel) => {
                
                console.log('Login successful, current user:', user);
                notify.success(`Welcome back ${user.firstName}!`);
                this.router.navigate(['/home']);
            },
            (err: any) => {
                console.error('Login failed:', err); // Log error
                console.error('Error details:', err.error); // Log detailed error information
                notify.error(err.message || 'Login failed');
                
            }
        );
      }
    }
