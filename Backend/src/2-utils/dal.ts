import mongoose from "mongoose";
import { appConfig } from "./app-config";

// DAL = Data Access Layer - The only one accessing the database.
class DAL {

    public async connect(): Promise<void> {
        try {
            const db = await mongoose.connect(appConfig.mongodbConnectionString);
            console.log(`We're connected to MongoDB, database: ${db.connections[0].name}`);
        }
        catch(err: any) {
            console.log(err);
        }
    }

}

export const dal = new DAL();
