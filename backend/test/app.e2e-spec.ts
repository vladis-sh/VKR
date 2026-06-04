import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';

describe('Interview Prep API (e2e)', () => {
  let app: INestApplication;
  let accessCookie: string;

  const getCookies = (res: request.Response) => {
    const cookieHeader = res.headers['set-cookie'];
    if (Array.isArray(cookieHeader)) {
      return cookieHeader;
    }

    return cookieHeader ? [cookieHeader] : [];
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';

    it('POST /auth/register - should register a new user', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: testEmail,
          password: testPassword,
          confirmPassword: testPassword,
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testEmail);
    });

    it('POST /auth/register - should fail with password mismatch', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'another@example.com',
          password: testPassword,
          confirmPassword: 'WrongPassword123!',
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('POST /auth/login - should login and set cookies', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: testEmail, password: testPassword })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testEmail);

      const cookies = getCookies(res);
      expect(cookies).toBeDefined();
      accessCookie = cookies.find((c) => c.startsWith('access_token='));
      expect(accessCookie).toBeDefined();
    });

    it('GET /auth/me - should return current user', async () => {
      const res = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Cookie', accessCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe(testEmail);
    });

    it('GET /auth/me - should fail without auth', async () => {
      await request(app.getHttpServer()).get('/auth/me').expect(401);
    });

    it('POST /auth/logout - should clear cookies', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Cookie', accessCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
    });
  });

  describe('Materials (unauthenticated)', () => {
    it('GET /materials - should require authentication', async () => {
      await request(app.getHttpServer()).get('/materials').expect(401);
    });
  });

  describe('Stats (authenticated)', () => {
    let authCookie: string;

    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'demo@example.com', password: 'password123' });

      if (res.status === 200) {
        const cookies = getCookies(res);
        authCookie = cookies.find((c) => c.startsWith('access_token='));
      }
    });

    it('GET /stats - should return user stats', async () => {
      if (!authCookie) return; // skip if demo user not seeded

      const res = await request(app.getHttpServer())
        .get('/stats')
        .set('Cookie', authCookie)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('completedTests');
    });
  });
});
