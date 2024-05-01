import Joi from "joi";
import { ValidationError } from "./client-errors";

export class CredentialsModel {

    public email: string;
    public password: string;

    public constructor(credentials: CredentialsModel) {
        this.email = credentials.email;
        this.password = credentials.password;
    }

    // Create a schema for validation:
    private static validationSchema = Joi.object({
        email: Joi.string().required().min(5).max(100).email(),
        password: Joi.string().required().min(4).max(50)
    });

    // Validating current object against the schema:
    public validate(): void {
        const result = CredentialsModel.validationSchema.validate(this);
        if (result.error) throw new ValidationError(result.error.message);
    }

}
