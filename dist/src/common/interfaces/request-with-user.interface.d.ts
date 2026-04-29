import { FastifyRequest } from 'fastify';
import { Role } from '../enums/role.enum';
export interface RequestWithUser extends FastifyRequest {
    user: {
        userId: string;
        email: string;
        role: Role;
    };
}
