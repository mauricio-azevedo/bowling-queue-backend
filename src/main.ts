import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Create and configure the Redis client (redis v4)
  const redisClient = createClient({ url: 'redis://localhost:6379' });
  redisClient.on('error', (err) => console.error('Redis Client Error', err));
  await redisClient.connect();

  // Configure express-session middleware with connect-redis store (v8)
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: process.env.SESSION_SECRET || 'your-secret-here',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // set true in production with HTTPS
        httpOnly: true,
        maxAge: 3600000, // 1 hour
      },
    }),
  );

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
