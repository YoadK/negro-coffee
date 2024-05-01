import express, { Request, Response, NextFunction } from "express";
import { UserModel } from "../3-models/user-model";
import { StatusCode } from "../3-models/enums";
import { CredentialsModel } from "../3-models/credentials-model";
import { authService } from "../5-services/auth-service";

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
            const user = new UserModel(request.body);
            const token = await authService.register(user);
            response.status(StatusCode.Created).json(token);
        }
        catch (err: any) { next(err); }
    }

    // POST http://localhost:4000/api/login --> Login existing user, return token:
    private async login(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const credentials = new CredentialsModel(request.body);
            const token = await authService.login(credentials);
            response.json(token);
        }
        catch (err: any) { next(err); }
    }
}

const authController = new AuthController();
export const authRouter = authController.router;
