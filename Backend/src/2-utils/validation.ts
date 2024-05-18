import { ValidationError } from "../3-models/client-errors";
import { ICredentialsModel } from "../3-models/credentials-model";
import { IUserModel } from "../3-models/user-model";

export function validateCredentials(credentials: ICredentialsModel): string[] {
    const errors: string[] = [];
  
    if (!credentials.email) {
      errors.push('Email is required.');
    } else if (!isValidEmail(credentials.email)) {
      errors.push('Email is not valid.');
    }
  
    if (!credentials.password) {
      errors.push('Password is required.');
    } else if (credentials.password.length < 4) {
      errors.push('Password must be at least 4 characters long.');
    } else if (credentials.password.length > 50) {
      errors.push('Password must be less than 50 characters long.');
    }
  
    return errors;
  }
  
  export function validateInsert(user: IUserModel): void {
    const errors: string[] = [];
  
    if (!user.firstName || user.firstName.length < 1 || user.firstName.length > 50) {
      errors.push('First name must be between 1 and 50 characters long.');
    }
  
    if (!user.lastName || user.lastName.length < 1 || user.lastName.length > 50) {
      errors.push('Last name must be between 1 and 50 characters long.');
    }
  
    if (!user.email || !isValidEmail(user.email)) {
      errors.push('A valid email is required.');
    }
  
    if (!user.password || user.password.length < 4 || user.password.length > 50) {
      errors.push('Password must be between 4 and 50 characters long.');
    }
  
    if (errors.length > 0) {
      throw new ValidationError(errors.join('\n'));
    }
  }

  // Helper function to validate email
  function isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
  