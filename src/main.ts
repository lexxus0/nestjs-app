import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //error-handler filter
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT ?? 8080);
  console.log(`Server is running on port 8080`);
}
bootstrap();
