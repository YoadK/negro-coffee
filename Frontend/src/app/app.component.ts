import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from './components/layout-area/layout/layout.component';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.module.scss'],
  standalone: true,
  imports: [LayoutComponent]
})


export class AppComponent{
    title = 'AppComponent ';
  }