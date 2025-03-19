import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { OrganizationAlreadyExistsError } from '@/use-cases/errors/organization-already-exists';
import { makeCreateOrganizationUseCase } from '@/use-cases/factories/make-create-organization-use-case';

const createBodySchema = z.object({
  name: z.string(),
  password: z.string(),
  email: z.string().email(),
  whatsapp: z.string(),
  authorName: z.string(),
  street: z.string(),
  neighborhood: z.string(),
  zipcode: z.string(),
  city: z.string(),
  state: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const data = createBodySchema.parse(request.body);

  try {
    const createOrganizationUseCase = makeCreateOrganizationUseCase();
    await createOrganizationUseCase.execute(data);
  } catch (error) {
    if (error instanceof OrganizationAlreadyExistsError) {
      return reply.status(error.code).send({ message: error.message });
      /* v8 ignore next 4 */
    }

    throw error;
  }

  return reply.status(201).send();
}
