import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../../../NgRx/state/app.states';
import { GetStatus } from '../../../NgRx/actions/auth.actions';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.store.dispatch(GetStatus());
  }

}
