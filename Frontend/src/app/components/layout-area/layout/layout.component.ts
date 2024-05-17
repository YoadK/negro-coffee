
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';


import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../HeaderArea/header/header.component';
import { FooterComponent } from '../../FooterArea/footer/footer.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterLink,RouterModule ,CommonModule, HeaderComponent,FooterComponent ],  
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.module.scss']  
})
export class LayoutComponent {
  // Add any necessary properties or methods here
}



