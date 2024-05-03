
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

import { AuthMenuComponent } from '../../Auth-area/auth-menu/auth-menu.component';

import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterLink,RouterModule,AuthMenuComponent ,CommonModule, NavbarComponent ],  
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.module.scss']  
})
export class LayoutComponent {
  // Add any necessary properties or methods here
}



