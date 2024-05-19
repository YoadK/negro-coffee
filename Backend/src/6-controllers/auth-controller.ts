import express, { Request, Response, NextFunction } from "express";
import { IUserModel } from "../3-models/user-model";
import { StatusCode } from  "../3-models/enums";
import { authService } from "../5-services/auth-service";
import { ICredentialsModel } from "../3-models/credentials-model";
import { validateInsert, validateCredentials } from "../2-utils/validation";

class AuthController {
    public readonly router = express.Router();

    public constructor() {
        this.registerRoutes();
    }

    private registerRoutes(): void {
        this.router.post("/register", this.register.bind(this));//The bind(this) is used to ensure that the this context is correctly set for the route handler methods.
        this.router.post("/login", this.login.bind(this));//The bind(this) is used to ensure that the this context is correctly set for the route handler methods.
    }

       // POST http://localhost:4000/api/register --> Register new user, return token:
    private register(request: Request, response: Response, next: NextFunction): void {
        const user: IUserModel = request.body;
        // validateInsert(user);
        authService.register(user).subscribe(
            result => {
                response.status(StatusCode.Created).json(result);
            },
            err => {
                next(err);
            }
        );
    }
    
    // POST http://localhost:4000/api/login --> Login existing user, return token:
    private login(request: Request, response: Response, next: NextFunction): void {
        debugger
        console.log ("login- backend (auth controller-backend)");
        const credentials: ICredentialsModel = request.body;
        console.log ("request body is: " + JSON.stringify(request.body));
        // validateCredentials(credentials);
        authService.login(credentials).subscribe(
            result => {
                response.json(result);
            },
            err => {
                next(err);
            }
        );
    }
}
    
export const authController = new AuthController();
export const authRouter = authController.router;