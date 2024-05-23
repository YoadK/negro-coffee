import { Component } from '@angular/core';
import { LayoutComponent } from './components/layout-area/layout/layout.component';
import { RouterOutlet } from '@angular/router';
import {RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.module.scss'],
  standalone: true,
  imports: [LayoutComponent]
})
export class AppComponent {
  title = 'app works!';
}
