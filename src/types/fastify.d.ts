import 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    requestId?: string;
    user?: {
      userId: string;
      email: string;
      role: string;
    };
  }
}
