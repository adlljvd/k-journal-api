import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: FastifyRequest, res: FastifyReply, next: () => void) {
    const requestId = (req.headers['x-request-id'] as string) || uuidv4();
    req.requestId = requestId;

    // Handle both Fastify production and testing contexts
    // In production with Fastify, use res.header()
    // In testing (light-my-request), we need to handle the wrapped response
    if (typeof res.header === 'function') {
      res.header('x-request-id', requestId);
    } else if (res.raw && typeof res.raw.setHeader === 'function') {
      res.raw.setHeader('x-request-id', requestId);
    }

    next();
  }
}
