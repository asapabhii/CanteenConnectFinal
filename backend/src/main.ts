import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';

let cachedApp: INestApplication | null = null;

async function createApp(): Promise<INestApplication> {
  if (cachedApp) {
    return cachedApp;
  }

  const server: Express = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: ['error', 'warn', 'log'],
  });

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.init();
  cachedApp = app;
  return app;
}

// Handler for Vercel serverless function
async function handler(req: Request, res: Response): Promise<void> {
  const app = await createApp();
  const server = app.getHttpAdapter().getInstance() as Express;

  // Strip /api prefix from the URL if present (Vercel routes /api/* to this handler)
  if (req.url?.startsWith('/api')) {
    req.url = req.url.slice(4) || '/';
  }

  server(req, res);
}

// For local development
async function bootstrap() {
  const server: Express = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}

// Start server for local development or export handler for Vercel
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  void bootstrap();
}

export default handler;
