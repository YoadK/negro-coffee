import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service'; // Adjust the path as necessary
import { UserModel } from '../../../models/user.model'; // Adjust the path as necessary
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-menu',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './auth-menu.component.html',
  styleUrls: ['./auth-menu.component.module.scss']
})
export class AuthMenuComponent implements OnInit {
  isAuthenticated: boolean = false;
  user: UserModel | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentAuthStatus.subscribe(user => {
        this.isAuthenticated = !!user;
        this.user = user;
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
