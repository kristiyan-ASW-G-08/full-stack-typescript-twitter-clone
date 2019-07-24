declare namespace NodeJS {
  interface ProcessEnv {
    SECRET: string;
    EMAIL: string;
    EMAIL_PASSWORD: string;
    CLIENT_URI: string;
  }
}
