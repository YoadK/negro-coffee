import { cyber } from "../2-utils/cyber";
import { UnauthorizedError, ValidationError } from "../3-models/client-errors";
import { ICredentialsModel } from "../3-models/credentials-model";
import { IUserModel } from "../3-models/user-model";
import { RoleModel } from "../3-models/role-model";
import { validateCredentials, validateInsert } from "../2-utils/validation";
import { from, Observable, map } from 'rxjs';



class AuthService {
    
    public register(user: IUserModel): Observable<{ token: string; user: IUserModel }> {
        return from(this.registerUser(user)).pipe(
            map(token => ({ token, user }))
        );
    }
    
    private registerUser(user: IUserModel): Observable<string> {
        return new Observable<string>(observer => {
            validateInsert(user);
            this.isEmailTaken(user.email).subscribe(
                isTaken => {
                    if (isTaken) {
                        observer.error(new ValidationError("Email already taken."));
                        return;
                    }
                    user.roleId = RoleModel.User;
                    user.password = cyber.hashPassword(user.password);
                    const newUser = new IUserModel(user);
                    newUser.save()
                        .then(() => {
                            const token = cyber.getNewToken(newUser);
                            console.log ("token is: ", token);
                            console.log ("is token valid? "+ cyber.isTokenValid(token) ? "true" : "false");
                            observer.next(token);
                            observer.complete();
                        })
                        .catch(error => {
                            observer.error(error);
                        });
                },
                error => {
                    observer.error(error);
                }
            );
        });
    }
    
    public login(credentials: ICredentialsModel): Observable<{ token: string; user: IUserModel; }> {
       
        return from(this.loginUser(credentials)).pipe(
            map(result => ({
                token: result.token,
                user: result.user
                
            }))
            
        );
      
    }
    
    private loginUser(credentials: ICredentialsModel): Observable<{ token: string; user: IUserModel; }> {
        return new Observable<{ token: string; user: IUserModel; }>(observer => {
            validateCredentials(credentials);
            this.getUserByEmail(credentials.email).subscribe(
                user => {
                    if (!user) {
                        observer.error(new UnauthorizedError("User not found."));
                        return;
                    }
                    const isPasswordValid = cyber.validatePassword(credentials.password, user.password);
                    if (!isPasswordValid) {
                        observer.error(new UnauthorizedError("Invalid password."));
                        return;
                    }
                    const token = cyber.getNewToken(user);
                    console.info('<auth service (backend)> Logged in user: ', user); // Add this line
                    observer.next({ token, user });
                    observer.complete();
                },
                error => {
                    observer.error(error);
                }
            );
        });
    }


    //A new getUserByEmail method is added to retrieve the user object by email, which 
    //is used in the login method of the controller to include the user object in the response.
    public getUserByEmail(email: string): Observable<IUserModel | null> {
        return new Observable<IUserModel | null>(observer => {
            IUserModel.findOne({ email })
                .then(user => {
                    observer.next(user);
                    observer.complete();
                })
                .catch(error => {
                    observer.error(error);
                });
        });
    }

    private isEmailTaken(email: string): Observable<boolean> {
        return new Observable<boolean>(observer => {
            IUserModel.findOne({ email })
                .then(existingUser => {
                    observer.next(!!existingUser);
                    observer.complete();
                })
                .catch(error => {
                    observer.error(error);                });
        });
    }
}


export const authService = new AuthService();