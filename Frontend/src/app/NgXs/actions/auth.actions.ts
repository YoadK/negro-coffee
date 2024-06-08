// auth.actions.ts
export class Login {
    static readonly type = '[Auth] Login';
    constructor(public payload: { username: string; password: string }) {}
  }
  
  export class Logout {
    static readonly type = '[Auth] Logout';
  }
  
  export class Register {
    static readonly type = '[Auth] Register';
    constructor(public payload: { username: string; password: string }) {}
  }
  
  export class AuthSuccess {
    static readonly type = '[Auth] Success';
    constructor(public payload: { user: any; token: string }) {}
  }
  
  export class AuthFailure {
    static readonly type = '[Auth] Failure';
    constructor(public payload: { error: any }) {}
  }
  