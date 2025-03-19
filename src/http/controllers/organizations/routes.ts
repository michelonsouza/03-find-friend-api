import { FastifyInstance } from 'fastify';

import { authenticate } from './authenticate';
import { create } from './create';
import { nearby } from './nearby';

export async function organizationRoutes(app: FastifyInstance) {
  app.post('/organizations', create);
  app.post('/organizations/auth', authenticate);
  app.get('/organizations/nearby', nearby);
}
