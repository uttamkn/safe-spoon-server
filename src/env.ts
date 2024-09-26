const validateEnv = (key: string, value: string | undefined): string => {
  if (!value) {
    console.error(`Environment variable ${key} not found`);
    throw new Error(`Environment variable ${key} not found`);
  }
  return value;
};

export const JWT_SECRET = validateEnv("JWT_SECRET", process.env.JWT_SECRET);
export const PORT = validateEnv("PORT", process.env.PORT);
export const MONGO_URI = validateEnv("MONGO_URI", process.env.MONGO_URI);
export const NODE_ENV = validateEnv("NODE_ENV", process.env.NODE_ENV);
export const MAILTRAP_API_KEY = validateEnv(
  "MAILTRAP_API_KEY",
  process.env.MAILTRAP_API_KEY,
);
export const TOGETHER_API_KEY = validateEnv(
  "TOGETHER_API_KEY",
  process.env.TOGETHER_API_KEY,
);
export const CLIENT_URL = validateEnv("CLIENT_URL", process.env.CLIENT_URL);
