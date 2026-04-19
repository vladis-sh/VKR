function requireSecret(name: string): string {
  const value = process.env[name];
  if (!value || value.length < 32) {
    throw new Error(
      `${name} must be set in environment and be at least 32 characters long`,
    );
  }
  return value;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} must be set in environment`);
  }
  return value;
}

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  database: {
    url: requireEnv('DATABASE_URL'),
  },
  jwt: {
    accessSecret: requireSecret('JWT_ACCESS_SECRET'),
    refreshSecret: requireSecret('JWT_REFRESH_SECRET'),
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  ai: {
    provider: process.env.AI_PROVIDER || 'mock',
    ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    ollamaModel: process.env.OLLAMA_MODEL || 'llama3',
  },
  uploads: {
    avatarsPath: './uploads/avatars',
  },
});
