import { Component, OnInit } from '@angular/core';
import { LayoutComponent } from './components/layout-area/layout/layout.component';
import { RouterOutlet } from '@angular/router';
import {RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from './NgRx/actions/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.module.scss'],
  standalone: true,
  imports: [LayoutComponent]
})


export class AppComponent implements OnInit {
    constructor(private store: Store) {}
  
    ngOnInit() {
      this.store.dispatch(AuthActions.loadUserFromLocalStorage());
      console.log('Dispatched loadUserFromLocalStorage action');
    }
  }