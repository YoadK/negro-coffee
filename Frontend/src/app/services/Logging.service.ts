// src/app/services/logging.service.ts

// for later usage (TODO: need to use this service all over the application)

import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  private isProduction = environment.PRODUCTION;

  log(message: string, source?: string): void {
    if (!this.isProduction) {
      const timestamp = new Date().toISOString();
      const sourceStr = source ? `[${source}]` : '';
      console.log(`${timestamp} ${sourceStr} ${message}`);
    }
  }

  error(message: string, error?: any, source?: string): void {
    if (!this.isProduction) {
      const timestamp = new Date().toISOString();
      const sourceStr = source ? `[${source}]` : '';
      console.error(`${timestamp} ${sourceStr} ERROR: ${message}`, error);
    }
  }

  warn(message: string, source?: string): void {
    if (!this.isProduction) {
      const timestamp = new Date().toISOString();
      const sourceStr = source ? `[${source}]` : '';
      console.warn(`${timestamp} ${sourceStr} WARNING: ${message}`);
    }
  }
}