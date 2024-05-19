import { createAction, props } from '@ngrx/store';
import { CredentialsModel } from '../../models/credentials.model';
import { UserModel } from '../../models/user.model';


export const register = createAction('[Auth] Register', props<{ user: UserModel }>());
export const registerSuccess = createAction('[Auth] Register Success', props<{ user: UserModel }>());
export const registerFailure = createAction('[Auth] Register Failure', props<{ error: any }>());

export const login = createAction('[Auth] Login', props<{ credentials: CredentialsModel }>());
export const loginSuccess = createAction('[Auth] Login Success', props<{ user: UserModel }>());
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: any }>());

export const logout = createAction('[Auth] Logout');
export const logoutSuccess = createAction('[Auth] Logout Success');
export const logoutFailure = createAction('[Auth] Logout Failure', props<{ error: any }>());
