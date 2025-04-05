import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const redisClient = createClient({ url: 'redis://localhost:6379' });
  redisClient.on('error', (err) => console.error('Redis Client Error', err));
  await redisClient.connect();

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: 'your-secret-here', // use environment variables in production
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // true if using HTTPS
        httpOnly: true,
        maxAge: 3600000, // 1 hour
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
