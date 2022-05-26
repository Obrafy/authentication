import { INestMicroservice, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from 'src/app.module';
import { protobufPackage } from 'src/common/dto/proto/auth.pb';
import { CatchAllExceptionFilter } from 'src/common/filters/http-exception.filter';
import { ConfigInterface } from 'src/config';

async function bootstrap() {
  const app: INestMicroservice = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: `${process.env.HOST}:${process.env.PORT}`,
      package: protobufPackage,
      protoPath: join('node_modules', 'proto', 'proto-files', 'authentication-service', 'auth.proto'),
    },
  });

  const config = app.get<ConfigService<ConfigInterface>>(ConfigService);
  app.useGlobalFilters(new CatchAllExceptionFilter(config));

  // Validate and Transform Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen();
}
bootstrap();
