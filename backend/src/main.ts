import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // <-- IMPORT HERE
import helmet from 'helmet'; // <-- IMPORT HERE

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet()); // <-- ADD THIS LINE
  app.enableCors(); // <-- ADD THIS LINE

   app.useGlobalPipes(new ValidationPipe()); // <-- ADD THIS LINE

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
