class EnvConfig {
  private baseUrl: string;
  private backendApiUrl: string;
  private xApiKey: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL as string;
    this.backendApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL as string;
    this.xApiKey = process.env.NEXT_PUBLIC_X_API_KEY as string;
  }

  getBaseDomain(): string {
    if (!this.baseUrl) {
      throw new Error("Base URL is not defined in environment variables");
    }
    return `${this.baseUrl}/`;
  }

  getApiUrl(): string {
    if (!this.backendApiUrl) {
      throw new Error("API URL is not defined in environment variables");
    }
    return `${this.backendApiUrl}/`;
  }

  getApiKey(): string {
    if (!this.xApiKey) {
      throw new Error("X-API-Key is not defined in environment variables");
    }
    return this.xApiKey;
  }
}

const config = new EnvConfig();
export default config;
