import 'express';

declare module 'express-serve-static-core' {
  export interface User {
    id: string;
  }
}
