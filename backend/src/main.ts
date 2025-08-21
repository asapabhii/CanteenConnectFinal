import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors({
    origin: process.env.FRONTEND_URL,
  });

  app.useGlobalPipes(new ValidationPipe());
  
  // Vercel handles starting the server, we just need to bootstrap the app
  await app.init();
  return app;
}

// Export the bootstrap function for Vercel
export default bootstrap();