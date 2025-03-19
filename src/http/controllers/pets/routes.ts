import { FastifyInstance } from 'fastify';

import { verifyJwt } from '@/http/middlewares/verify-jwt';

import { create } from './create';
import { getPet } from './get-pet';
import { search } from './search';

export async function petRoutes(app: FastifyInstance) {
  app.post('/organizations/pets', { onRequest: [verifyJwt] }, create);
  app.get('/organizations/pets', search);
  app.get('/organizations/pets/:id', getPet);
}
