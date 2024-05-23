// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    PRODUCTION: false,
    ENVIRONMENT: 'development',
    PORT: 4000,
    MONGODB_CONNECTION_STRING: 'mongodb://127.0.0.1:27017/negro_coffee-db',
    JWT_SECRET_KEY: 'The Amazing Full Stack App!',
    PASSWORD_SALT: '!עם ישראל חי',
    BASE_IMAGE_URL: 'http://localhost:4000/api/products/images/'
  };

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
