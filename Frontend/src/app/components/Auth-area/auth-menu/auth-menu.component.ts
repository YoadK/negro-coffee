import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './auth-menu.component.html',
  styleUrl: './auth-menu.component.module.css'
})
export class AuthMenuComponent {

}
