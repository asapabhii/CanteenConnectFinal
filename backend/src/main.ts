import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  });

  app.useGlobalPipes(new ValidationPipe());

  // For local development, we need to listen on a port
  if (process.env.NODE_ENV !== 'production') {
    await app.listen(3000);
    console.log('Server running on http://localhost:3000');
  } else {
    // Vercel handles starting the server, we just need to bootstrap the app
    await app.init();
  }
  return app;
}

// Export the bootstrap function for Vercel
export default bootstrap();
