import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { appConfig } from '../../../app.config';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(): void {
    if (this.email && this.password) {
      this.http.post(appConfig.registerUrl, {
        email: this.email,
        password: this.password
      }).subscribe(
        response => {
          console.log('Registration successful', response);
          this.router.navigate(['/login']); // Redirect to login page on success
        },
        error => {
          console.error('Registration failed', error);
        }
      );
    }
  }
}
