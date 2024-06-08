// src/app/ngrx/reducers/index.ts

//Serves as a central place to export your NgRx-related modules and interfaces. 
//This makes it easier to import them in other parts of your application
//By organizing your index.ts file this way, you make it easier to manage and import your NgRx-related code
import { ActionReducerMap } from '@ngrx/store';
// import { authReducer } from './auth.reducer';
// import { AuthState } from '../state/auth.state';
import { authReducer, AuthState } from './auth.reducer';

// Define the shape of your application's state
export interface AppState {
  auth: AuthState;
}

// Map of reducers to manage your application's state
export const AllReducers: ActionReducerMap<AppState> = {
  auth: authReducer,
};

// Exporting the necessary modules, interfaces, and actions
export * from '../actions/auth.actions'
export * from '../effects/auth.effects';
export * from '../Selectors/auth.selectors';
export * from './auth.reducer';



