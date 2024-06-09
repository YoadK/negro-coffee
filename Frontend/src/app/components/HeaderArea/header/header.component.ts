import { Component } from '@angular/core';
import { AuthMenuComponent } from '../../Auth-area/auth-menu/auth-menu.component';
import { NavbarComponent } from '../../layout-area/navbar/navbar.component';

@Component({
  selector: 'app-header',
   standalone: true,
    imports: [AuthMenuComponent,NavbarComponent],
   templateUrl: './header.component.html',
  styleUrl: './header.component.module.scss',
})
export class HeaderComponent {

}
