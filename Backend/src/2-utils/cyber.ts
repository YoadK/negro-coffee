import { IUserModel } from "../3-models/user-model";
import jwt, { SignOptions } from "jsonwebtoken";
import { appConfig } from "./app-config";
import { RoleModel } from "../3-models/role-model";
import crypto from "crypto";

class Cyber {

    public getNewToken(user: IUserModel): string {

        // Remove password from user:
        delete user.password;

        // Create container object containing the user: (jwt token)
        const container = { user };

        // Create options:
        const options: SignOptions = { expiresIn: "5h" };

        // Create token:
        const token = jwt.sign(container, appConfig.jwtSecretKey, options);

        // Return:
        return token;
    }

    // Check if token is valid:
    public isTokenValid(token: string): boolean {
        try {

            // If no token:
            if (!token) return false;

            // Verify token:
            jwt.verify(token, appConfig.jwtSecretKey);

            // All is good:
            return true;
        }
        catch (err: any) { // Token is not valid.
            return false;
        }
    }

    // Check if user is admin:
    public isAdmin(token: string): boolean {

        // Extract container from token:
        const container = jwt.decode(token) as { user: IUserModel };

        // Extract user from container:
        const user = container.user;

        // Return true if user is Admin:
        return user.roleId === RoleModel.Admin;
    }

    // Hash password:
    public hashPassword(plainText: string): string {

        // SHA = Secured Hashing Algorithm.
        // HMAC = Hash-Based Message Authentication Code
        const hashedPassword = crypto.createHmac("sha512", appConfig.passwordSalt).update(plainText).digest("hex");

        // Return:
        return hashedPassword;
    }

    // Validate password:
    public validatePassword(plainText: string, hashedPassword: string): boolean {

        // Hash the plain text password:
        const hash = crypto.createHmac("sha512", appConfig.passwordSalt).update(plainText).digest("hex");

        // Compare hashed passwords:
        return hash === hashedPassword;
    }
}

export const cyber = new Cyber();
