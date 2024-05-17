import { createAction, props } from '@ngrx/store';
import { ICredentialsModel } from '../../models/credentials.model';
import { IUserModel } from '../../models/user.model';


export const register = createAction('[Auth] Register', props<{ credentials: ICredentialsModel }>());
export const registerSuccess = createAction('[Auth] Register Success', props<{ user: IUserModel }>());
export const registerFailure = createAction('[Auth] Register Failure', props<{ error: any }>());

export const login = createAction('[Auth] Login', props<{ credentials: ICredentialsModel }>());
export const loginSuccess = createAction('[Auth] Login Success', props<{ user: IUserModel }>());
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: any }>());

export const logout = createAction('[Auth] Logout');
export const logoutSuccess = createAction('[Auth] Logout Success');
export const logoutFailure = createAction('[Auth] Logout Failure', props<{ error: any }>());
