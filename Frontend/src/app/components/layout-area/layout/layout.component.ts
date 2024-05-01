
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterLink,RouterModule,NavbarComponent],  
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.module.css']  
})
export class LayoutComponent {
  // Add any necessary properties or methods here
}



