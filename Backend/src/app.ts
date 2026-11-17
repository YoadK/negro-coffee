import cors from "cors";
import express from "express";
import expressFileUpload from "express-fileupload";
import path from "path";
import { fileSaver } from "uploaded-file-saver";
import { errorsMiddleware } from "./4-middleware/errors-middleware";
import { loggerMiddleware } from "./4-middleware/logger-middleware";
import { productsRouter } from "./6-controllers/products-controller";
import { dal } from "./2-utils/dal";
import { authRouter } from "./6-controllers/auth-controller";
import { categoriesRouter } from "./6-controllers/categories-controller";
import { appConfig } from './2-utils/app-config';
import { rateLimit } from "express-rate-limit";
import { securityMiddleware } from "./4-middleware/security-middleware";


// Main application class:
class App {

    // Express server: 
    private server = express();

    // Start app:
    public async start(): Promise<void> {

        // Enable CORS requests:
        this.server.use(cors()); // Enable CORS for any frontend website.

        // Limit requests per IP (images excluded), and much stricter for login/register (against password guessing):
        this.server.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 1000, skip: securityMiddleware.skipRateLimit }));
        this.server.use(["/api/login", "/api/register"], rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, message: { message: "Too many attempts, please try again later." } }));

        // Create a request.body containing the given json from the front:
        this.server.use(express.json());

        // Create request.files containing uploaded files:
        this.server.use(expressFileUpload());

        // Strip HTML tags from string fields (XSS protection):
        this.server.use(securityMiddleware.sanitizeXss);

        // Configure images folder: 
        fileSaver.config(path.join(__dirname, "1-assets", "images"));

        


        // Register middleware:
        this.server.use(loggerMiddleware.logToConsole);

        // Connect any controller route to the server:
        this.server.use("/api", authRouter, productsRouter, categoriesRouter);

        // Route not found middleware: 
        this.server.use(errorsMiddleware.routeNotFound);

        // Catch all middleware: 
        this.server.use(errorsMiddleware.catchAll);

        // Connect to MongoDB: 
        await dal.connect();

        // Run server:
        this.server.listen(appConfig.PORT, () => console.log("Listening on http://localhost:" + appConfig.PORT));
    }

}

const app = new App();
app.start();
