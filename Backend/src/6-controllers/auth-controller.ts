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
        this.router.post("/register", this.register.bind(this));
        this.router.post("/login", this.login.bind(this));
        this.router.get("/status", this.status.bind(this));
    }

    // POST http://localhost:4000/api/register --> Register new user, return token:
    private register(request: Request, response: Response, next: NextFunction): void {
        const user: IUserModel = request.body;
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
        console.log("login- backend (auth controller-backend)");
        const credentials: ICredentialsModel = request.body;
        console.log("request body is: " + JSON.stringify(request.body));
        authService.login(credentials).subscribe(
            result => {
                response.json(result);
            },
            err => {
                next(err);
            }
        );
    }

    // GET http://localhost:4000/api/status --> Check user status
    private status(request: Request, response: Response, next: NextFunction): void {
        if (!(request.headers && request.headers.authorization)) {
            response.status(400).json({
                status: 'error'
            });
            return;
        }

        const header = request.headers.authorization.split(' ');
        const token = header[1];
        if (token === '1234567') {
            response.status(200).json({
                status: 'success',
            });
        } else {
            response.status(401).json({
                status: 'error'
            });
        }
    }
}

export const authController = new AuthController();
export const authRouter = authController.router;
