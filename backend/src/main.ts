import 'module-alias/register';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import express from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { AppModule } from './app.module';
import { TrpcRouter } from './trpc/trpc.router';
import { TrpcContextFactory } from './trpc/trpc.context';
import { logger } from './common/logging';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.setGlobalPrefix('api');

  // tRPC is the single source of truth for the API surface.
  // The Next.js frontend proxies /api/trpc → this endpoint.
  // Body parsers are registered here because this middleware runs before
  // Nest's own (init-time) body parser in the express stack.
  const trpcRouter = app.get(TrpcRouter);
  const trpcContext = app.get(TrpcContextFactory);
  app.use(
    '/api/trpc',
    express.json({ limit: '4mb' }),
    express.urlencoded({ extended: true }),
    (req: any, _res: any, next: any) => {
      console.warn('[trpc-probe]', req.method, 'ct=', req.headers['content-type'], 'bodyType=', typeof req.body);
      next();
    },
    createExpressMiddleware({
      router: trpcRouter.appRouter,
      createContext: ({ req }) => trpcContext.create(req),
    }),
  );

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  logger.info('backend listening on :' + port);
}

void bootstrap();
