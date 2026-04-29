import { NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
export declare class RequestIdMiddleware implements NestMiddleware {
    use(req: FastifyRequest, res: FastifyReply, next: () => void): void;
}
