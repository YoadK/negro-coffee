import express, { Request, Response, NextFunction } from "express";
import { IUserModel, UserModel } from "../3-models/user-model";
import { StatusCode } from "../3-models/enums";
import { authService } from "../5-services/auth-service";
import { CredentialsModel } from "../3-models/credentials-model";
import { validateInsert } from "../2-utils/validation";
import { validateCredentials } from "../2-utils/validation";

class AuthController {

    public readonly router = express.Router();

    public constructor() {
        this.registerRoutes();
    }

    private registerRoutes(): void {
        this.router.post("/register", this.register);
        this.router.post("/login", this.login);
    }

    // POST http://localhost:4000/api/register --> Register new user, return token:
    private async register(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const user: IUserModel = request.body;
            
            // Validate the user using the validation function
            validateInsert(user);

            const token = await authService.register(user);
            response.status(StatusCode.Created).json(token);
        } catch (err: any) {
            next(err);
        }
    }

    // POST http://localhost:4000/api/login --> Login existing user, return token:
    private async login(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const credentials: CredentialsModel = request.body;
            validateCredentials(credentials);
            const token = await authService.login(credentials);
            response.json(token);
        } catch (err: any) {
            next(err);
        }
    }
}

const authController = new AuthController();
export const authRouter = authController.router;
