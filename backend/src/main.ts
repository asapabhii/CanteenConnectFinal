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
  
  // Vercel handles the port, so we only listen locally
  if (process.env.NODE_ENV === 'development') {
    await app.listen(3000);
  }

  return app; // <-- Add this return statement
}

// Export the bootstrap function for Vercel
export default bootstrap();