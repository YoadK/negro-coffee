import { CredentialsModel } from "../../models/credentials.model";
import { UserModel } from "../../models/user.model";

// auth.actions.ts
export class Login {
    static readonly type = '[Auth] Login';
    constructor(public payload: CredentialsModel) {}
  }
  

  
  export class Register {
    static readonly type = '[Auth] Register';
    constructor(public payload: UserModel) {}
  }
  
  export class AuthSuccess {
    static readonly type = '[Auth] Success';
    constructor(public payload: { user: UserModel; token: string }) {}
  }
  
  export class AuthFailure {
    static readonly type = '[Auth] Failure';
    constructor(public payload: { error: any }) {}
  }
  
  export class Logout {
    static readonly type = '[Auth] Logout';
  }

  export class LoadStoredTokenAndUser {
    static readonly type = '[Auth] Load Stored Token and User';
  }
  