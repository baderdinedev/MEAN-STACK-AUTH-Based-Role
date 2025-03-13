import fs from "fs";
import path from "path";

class Logger {
  static logFile = path.join(process.cwd(), "logs", "app.log");

  static log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;

    fs.appendFile(this.logFile, logMessage, (err) => {
      if (err) console.error("Error writing log:", err);
    });
  }

  static error(message) {
    this.log(`ERROR: ${message}`);
  }

  static info(message) {
    this.log(`INFO: ${message}`);
  }
}

export default Logger;
