import { ProcessEnv as CurrentProcessEnv } from './process-env.interface';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends CurrentProcessEnv {}
  }
}

export {};
