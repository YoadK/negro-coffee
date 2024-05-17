import { cyber } from "../2-utils/cyber";
import { UnauthorizedError, ValidationError } from "../3-models/client-errors";
import { CredentialsModel } from "../3-models/credentials-model";
import { IUserModel, UserModel } from "../3-models/user-model";
import { RoleModel } from "../3-models/role-model";
import { validateCredentials, validateInsert } from "../2-utils/validation";

class AuthService {
  // Register new user:
  public async register(user: IUserModel): Promise<string> {
    // Validate:
    validateInsert(user);

    // Check if email is taken:
    const isTaken = await this.isEmailTaken(user.email);
    if (isTaken) throw new ValidationError("Email already taken.");

    // Init roleId as regular user:
    user.roleId = RoleModel.User;

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
    // Validate credentials:
    validateCredentials(credentials);

    // Find user by email:
    const user = await UserModel.findOne({ email: credentials.email });
    if (!user) throw new UnauthorizedError("User not found.");

    // Validate password:
    const isPasswordValid = cyber.validatePassword(credentials.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedError("Invalid password.");

    // Create new token:
    const token = cyber.getNewToken(user);
    return token;
  }

  // Is email taken:
  private async isEmailTaken(email: string): Promise<boolean> {
    // Check if email is taken:
    const existingUser = await UserModel.findOne({ email });
    return !!existingUser;
  }
}

export const authService = new AuthService();
