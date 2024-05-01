import fsPromises from "fs/promises";
// import path from "path";

class Logger {

    private filePath = "errors.log";

    public async logError(err: any): Promise<void> {
        const now = new Date();
        const content = `Time: ${now}\nMessage: ${err.message}\nStack: ${err.stack}\n---------------------------------------\n\n`
        fsPromises.appendFile(this.filePath, content);
    }

}

export const logger = new Logger();
