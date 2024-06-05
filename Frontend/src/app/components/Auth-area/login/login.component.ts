import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CredentialsModel } from '../../../models/credentials.model';
import { notify } from '../../../Utils/Notify';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { UserModel } from '../../../models/user.model';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../NgRx/actions/auth.actions';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
 import { login } from '../../../NgRx/actions/auth.actions';
 import { selectToken, selectError, selectIsLoading } from '../../../NgRx/Selectors/auth.selectors';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.module.scss']
})
export class LoginComponent implements OnDestroy{
//     username = '';
//     password = '';
//     token = '';
//     error = '';
//     isLoading = false;
  
//     constructor(private store: Store<AppState>) {
//     //   this.store.select(selectToken).subscribe(token => (this.token = token));
//     //   this.store.select(selectError).subscribe(error => (this.error = error));
//       this.store.select(selectIsLoading).subscribe(isLoading => (this.isLoading = isLoading));
//     }
   
  

//     // login.component.ts
//     this.store.select(selectIsLoading).subscribe(isLoading => {
//     this.isLoading = isLoading as boolean; // Ensure this is boolean
//   });
  
//     this.store.select(selectToken).subscribe(token => {
//     this.token = token as string; // Ensure this is string
//   });
  
//     this.store.select(selectError).subscribe(error => {
//     this.error = error as string; // Ensure this is string
//   });

  
    ngOnDestroy(): void {
        console.log('ngOnDestroy');
    }
  
//     onSubmit() {
//     //   this.store.dispatch(login({ username: this.username, password: this.password }));
//     }
}