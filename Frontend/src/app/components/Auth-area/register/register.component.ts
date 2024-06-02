import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { notify } from '../../../Utils/Notify';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserModel } from '../../../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppState, selectAuthState } from '../../../NgRx/state/app.states';
import { Store } from '@ngrx/store';
import { Signup } from '../../../NgRx/actions/auth.actions';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.module.scss']
})
export class RegisterComponent implements OnInit {
  public user: UserModel = new UserModel();
  getState: Observable<any>;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.getState = this.store.select(selectAuthState);
  }

  ngOnInit() {
    this.getState.subscribe((state) => {
      this.errorMessage = state.errorMessage;
    });
  }

  onSubmit(): void {
    const payload = {
      email: this.user.email,
      password: this.user.password
    };
    this.store.dispatch( Signup(payload));
  }
}