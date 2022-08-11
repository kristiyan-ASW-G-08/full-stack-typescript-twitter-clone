declare namespace NodeJS {
  interface ProcessEnv {
    SECRET: string;
    EMAIL: string;
    EMAIL_PASSWORD: string;
    PORT: string;
    PORT: number;
    CLIENT_URL: string;
    ALLOW_IMAGES: string;
    CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    API_SECRET: string;
  }
}
