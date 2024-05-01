import { cyber } from "../2-utils/cyber";
import { CredentialsModel } from "../3-models/credentials-model";
import { UserModel } from "../3-models/user-model";


class AuthService {
    // Register new user:
    public async register(user: any): Promise<string> {
        // Check if email is taken:
        const existingUser = await UserModel.findOne({ email: user.email });
        if (existingUser) throw new Error("Email already taken.");

        // Hash password:
        user.password = cyber.hashPassword(user.password);

        // Save new user:
        const newUser = new UserModel(user);
        await newUser.save();

        // Create new token:
        const token = cyber.getNewToken(newUser);
        return token;
    }

    // Login existing user:
    public async login(credentials: CredentialsModel): Promise<string> {
        // Validate credentials 
        credentials.validate();

        // Find user by email:
        const user = await UserModel.findOne({ email: credentials.email });
        if (!user) throw new Error("User not found.");


        // Create new token:
        const token = cyber.getNewToken(user);
        return token;
    }
}
export const authService = new AuthService();
