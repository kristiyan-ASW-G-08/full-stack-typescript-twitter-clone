declare namespace NodeJS {
  interface ProcessEnv {
    SECRET: string;
    EMAIL: string;
    EMAIL_PASSWORD: string;
    SERVER_URL: string;
    PORT: number;
    CLIENT_URL: string;
  }
}
