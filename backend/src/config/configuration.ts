function requireSecret(name: string): string {
  const value = process.env[name];
  if (!value || value.length < 32) {
    throw new Error(`${name} must be set in environment and be at least 32 characters long`);
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
    deepseekApiKey: (process.env.DEEPSEEK_API_KEY || '').trim(),
    deepseekModel: (process.env.DEEPSEEK_MODEL || 'deepseek-chat').trim(),
    deepseekBaseUrl: (process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com').trim(),
  },
  mail: {
    // HTTPS-based sending (port 443) for hosts where outbound SMTP is blocked.
    // Takes priority over SMTP when set; resend wins over brevo.
    resendApiKey: (process.env.RESEND_API_KEY || '').trim(),
    brevoApiKey: (process.env.BREVO_API_KEY || '').trim(),
    // Empty host => fall back to an Ethereal test inbox (preview URL in logs).
    host: (process.env.SMTP_HOST || '').trim(),
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    user: (process.env.SMTP_USER || '').trim(),
    pass: (process.env.SMTP_PASS || '').trim(),
    from: (process.env.MAIL_FROM || 'InterviewPrep <no-reply@interviewprep.local>').trim(),
  },
  uploads: {
    avatarsPath: './uploads/avatars',
  },
});
