import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
// Import your actions here

@Injectable()
export class AppEffects {
  constructor(private actions$: Actions) {}

  // Define your effects here
}
