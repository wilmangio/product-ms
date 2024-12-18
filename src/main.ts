import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('ProductsMS');

  // const app = await NestFactory.create(AppModule);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,// Transport.TCP,
      options:{
        //port: envs.port
        servers:envs.natsServers
      }
    }
  );
  
  //para que el class-validator y el class-transformer funcionen
  app.useGlobalPipes(
    new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true, // properties deben quedar como uno quiere que vengan
    })
   );

  // await app.listen(envs.port ?? 3000);
  await app.listen();
  logger.log(`Products Microservice corriendo en port ${ envs.port }`);
}
bootstrap();
