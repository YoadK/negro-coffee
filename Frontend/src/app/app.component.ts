import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from './components/layout-area/layout/layout.component';
import { AuthService } from './services/auth.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.module.scss'],
  standalone: true,
  imports: [LayoutComponent]
})


export class AppComponent implements OnInit {
    title = 'AppComponent ';
    constructor(private authService: AuthService) {}
  
    ngOnInit() {
      this.authService.loadStoredToken();
    }
  }




