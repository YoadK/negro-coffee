import { IUserModel } from "../3-models/Iuser-model";
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
        const token = jwt.sign(container, appConfig.JWT_SECRET_KEY, options);
        // Return:
        return token;
    }

    // Check if token is valid:
    public isTokenValid(token: string): boolean {
        try {

            // If no token:
            if (!token) return false;

            // Verify token:
            jwt.verify(token, appConfig.JWT_SECRET_KEY);

            // All is good:
            console.log("token is valid");
            return true;
        }
        catch (err: any) { // Token is not valid.
            console.log("token is invalid");
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
        const hashedPassword = crypto.createHmac("sha512", appConfig.PASSWORD_SALT).update(plainText).digest("hex");

        // Return:
        return hashedPassword;
    }

    // Validate password:
    public validatePassword(plainText: string, hashedPassword: string): boolean {

        // Hash the plain text password:
        const hash = crypto.createHmac("sha512", appConfig.PASSWORD_SALT).update(plainText).digest("hex");

        // Compare hashed passwords:
        return hash === hashedPassword;
    }

    // Check if a password was hashed with the old (leaked) salt - such hashes get upgraded on login:
    public isLegacyPassword(plainText: string, hashedPassword: string): boolean {
        if (!appConfig.OLD_PASSWORD_SALT) return false;
        const hash = crypto.createHmac("sha512", appConfig.OLD_PASSWORD_SALT).update(plainText).digest("hex");
        return hash === hashedPassword;
    }
}

export const cyber = new Cyber();
