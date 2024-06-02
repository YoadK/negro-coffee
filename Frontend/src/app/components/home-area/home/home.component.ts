import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, selectAuthState } from '../../../NgRx/state/app.states';
import { Logout } from '../../../NgRx/actions/auth.actions';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { UserModel } from '../../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.module.scss'],
})
export class HomeComponent implements OnInit {
  getState: Observable<any>;
  isAuthenticated: boolean = false;
  user: UserModel | null = null;
  errorMessage: string | null = null;

  constructor(private store: Store<AppState>) {
    this.getState = this.store.select(selectAuthState);
  }

  ngOnInit() {
    this.getState.subscribe((state) => {
      this.isAuthenticated = state.isAuthenticated;
      this.user = state.user;
      this.errorMessage = state.errorMessage;
    });
  }

  logout(): void {
    this.store.dispatch( Logout());
  }
}