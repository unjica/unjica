declare module 'facebook-nodejs-business-sdk' {
  export class BusinessDataAPI {
    constructor(accessToken: string);
    call(method: string, path: string, params?: Record<string, any>): Promise<any>;
  }
} 