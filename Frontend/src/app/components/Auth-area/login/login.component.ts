import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ICredentialsModel } from '../../../models/credentials.model';
import { validateCredentials } from '../../../Utils/validation';
import { appConfig } from '../../../app.config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials: ICredentialsModel = { email: '', password: '' };

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(): void {
    const errors = validateCredentials(this.credentials);
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    this.http.post(appConfig.loginUrl, this.credentials).subscribe(
      response => {
        console.log('Login successful', response);
        this.router.navigate(['/products']); // Redirect to products page on success
      },
      error => {
        console.error('Login failed', error);
      }
    );
  }
}
