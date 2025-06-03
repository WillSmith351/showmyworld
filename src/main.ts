import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
  app.useGlobalFilters(new PrismaExceptionFilter());
}

export function registerGlobals(app: INestApplication) {
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector), {}));
}
void bootstrap();
