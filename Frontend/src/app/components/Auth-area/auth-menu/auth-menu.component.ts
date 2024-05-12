import { Component } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './auth-menu.component.html',
  styleUrl: './auth-menu.component.module.css'
})
export class AuthMenuComponent {
   
}
