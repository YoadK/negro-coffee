import { CredentialsModel } from "../../models/credentials.model";
import { UserModel } from "../../models/user.model";

// auth.actions.ts- some NGXS-realted explanations are added here...

// actions are represented by classes. 
//Every action class has a static property named type that acts as a unique identifier. 
//It's a constant string value, ensuring clarity and avoiding potential naming conflicts.
export class Login {
    
    //This static property defines a unique identifier for the action. In this case, it's set to '[Auth] Login'.
    static readonly type = '[Auth] Login';

    //Constructor (Optional): The constructor can take arguments that represent the action's payload. Here,
    // the 'Login' constructor takes a 'payload' argument of a 'CredentialsModel' type.
    //An action class can optionally have a constructor, allowing you to define arguments that constitute 
    //the action's payload. This payload carries any data required for the associated state update.
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
  
  export class SetLoading {
    static readonly type = '[Auth] Set Loading';
    constructor(public payload: boolean) {}
  }

  
export class LogCurrentState {
    static readonly type = '[Auth] Log Current State';
  }