import { createAction, props } from '@ngrx/store';
import { CredentialsModel } from '../../models/credentials.model';
import { UserModel } from '../../models/user.model';


export const register = createAction('[Auth] Register', props<{ user: UserModel }>());
export const registerSuccess = createAction('[Auth] Register Success', props<{ user: UserModel; token: string }>());
export const registerFailure = createAction('[Auth] Register Failure', props<{ error: any }>());

export const login = createAction('[Auth] Login', props<{ credentials: CredentialsModel }>());
export const loginSuccess = createAction('[Auth] Login Success',
    props<{ user: UserModel; token: string }>()
);
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: any }>());

export const logout = createAction('[Auth] Logout');
export const logoutSuccess = createAction('[Auth] Logout Success');
export const logoutFailure = createAction('[Auth] Logout Failure', props<{ error: any }>());


export const loadUserFromLocalStorage = createAction('[Auth] Load User From Local Storage');
export const loadUserFromLocalStorageSuccess = createAction(
    '[Auth] Load User From Local Storage Success',
    props<{ user: UserModel; token: string }>()
);

export const loadUserFromLocalStorageFailure = createAction('[Auth] Load User From Local Storage Failure');


export const setUser = createAction('[Auth] Set User', props<{ user: UserModel }>());
export const clearUser = createAction('[Auth] Clear User');
