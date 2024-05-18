import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CredentialsModel } from '../../../models/credentials.model';
import { notify } from '../../../Utils/Notify';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.module.scss']
})
export class LoginComponent {
    credentials: CredentialsModel = { email: '', password: '' };

    constructor(private authService:AuthService ,private http: HttpClient, private router: Router) { }

    async onSubmit() {
        try {
            await this.authService.login(this.credentials);
            const user = this.authService.getCurrentUser();
            notify.success(`Welcome back ${user.firstName}!`);
            this.router.navigate(['/home']);
        } catch (error: any) {
            notify.error(error);
        }
    }
}
