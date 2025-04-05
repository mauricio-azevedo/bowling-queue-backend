import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const redisClient = createClient({
    url: configService.get<string>('REDIS_URL'),
  });
  redisClient.on('error', (err) => console.error('Redis Client Error', err));
  await redisClient.connect();

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: configService.get<string>('SESSION_SECRET', 'secret'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // Set true in production when using HTTPS
        httpOnly: true,
        maxAge: 3600000, // 1 hour
      },
    }),
  );

  await app.listen(parseInt(configService.get<string>('PORT', '3000')));
}
bootstrap();
