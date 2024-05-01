import dotenv from "dotenv";

// Load ".env" file into process.env object:
dotenv.config();

class AppConfig {
    public readonly isDevelopment = process.env.ENVIRONMENT === "development";
    public readonly isProduction = process.env.ENVIRONMENT === "production";
    public readonly port = process.env.PORT;
    public readonly mongodbConnectionString = process.env.MONGODB_CONNECTION_STRING;
    public readonly jwtSecretKey = process.env.JWT_SECRET_KEY;
    public readonly passwordSalt = process.env.PASSWORD_SALT;
    public readonly baseImageUrl = process.env.BASE_IMAGE_URL;
}

export const appConfig = new AppConfig();
