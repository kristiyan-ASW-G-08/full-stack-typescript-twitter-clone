declare namespace NodeJS {
  interface ProcessEnv {
    SECRET: string;
    EMAIL: string;
    EMAIL_PASSWORD: string;
    SERVER_URL: string;
    REDIS_PORT: number;
    REDIS_HOST: string;
  }
}
