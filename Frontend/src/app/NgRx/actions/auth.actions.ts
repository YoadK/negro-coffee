import { createAction, props } from '@ngrx/store';
import { UserModel } from '../../models/user.model';

export enum AuthActionTypes {
  LOGIN = '[Auth] Login',
  LOGIN_SUCCESS = '[Auth] Login Success',
  LOGIN_FAILURE = '[Auth] Login Failure',
  SIGNUP = '[Auth] Signup',
  SIGNUP_SUCCESS = '[Auth] Signup Success',
  SIGNUP_FAILURE = '[Auth] Signup Failure',
  LOGOUT = '[Auth] Logout',
  GET_STATUS = '[Auth] GetStatus'
}

export const Login = createAction(
  AuthActionTypes.LOGIN,
  props<{ email: string; password: string }>()
);

export const LoginSuccess = createAction(
  AuthActionTypes.LOGIN_SUCCESS,
  props<{ user: UserModel }>()
);

export const LoginFailure = createAction(
  AuthActionTypes.LOGIN_FAILURE,
  props<{ error: string }>()
);

export const Signup = createAction(
  AuthActionTypes.SIGNUP,
  props<{ email: string; password: string }>()
);

export const SignupSuccess = createAction(
  AuthActionTypes.SIGNUP_SUCCESS,
  props<{ user: UserModel }>()
);

export const SignupFailure = createAction(
  AuthActionTypes.SIGNUP_FAILURE,
  props<{ error: string }>()
);

export const Logout = createAction(
  AuthActionTypes.LOGOUT
);

export const GetStatus = createAction(
  AuthActionTypes.GET_STATUS
);

export type AuthActions =
  | ReturnType<typeof Login>
  | ReturnType<typeof LoginSuccess>
  | ReturnType<typeof LoginFailure>
  | ReturnType<typeof Signup>
  | ReturnType<typeof SignupSuccess>
  | ReturnType<typeof SignupFailure>
  | ReturnType<typeof Logout>
  | ReturnType<typeof GetStatus>;