import dotenv from "dotenv";
import path from "path";

// Load secrets from Backend/.env (never committed to git):
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

// Read a required environment variable, fail fast if missing:
function required(name: string): string {
    const value = process.env[name];
    if (!value) throw new Error(`Missing environment variable "${name}" - see Backend/.env.example`);
    return value;
}

// Backend configuration - secrets live here, NOT in the frontend environment files:
class AppConfig {
    public readonly PRODUCTION = process.env.ENVIRONMENT === "production";
    public readonly ENVIRONMENT = process.env.ENVIRONMENT || "development";
    public readonly PORT = Number(process.env.PORT) || 4000;
    public readonly MONGODB_CONNECTION_STRING = required("MONGODB_CONNECTION_STRING");
    public readonly JWT_SECRET_KEY = required("JWT_SECRET_KEY");
    public readonly PASSWORD_SALT = required("PASSWORD_SALT");
    // Optional - the previous (leaked) salt, used only to upgrade old password hashes on login:
    public readonly OLD_PASSWORD_SALT = process.env.OLD_PASSWORD_SALT || "";
    public readonly BASE_IMAGE_URL = process.env.BASE_IMAGE_URL || `http://localhost:${this.PORT}/api/products/images/`;
}

export const appConfig = new AppConfig();
