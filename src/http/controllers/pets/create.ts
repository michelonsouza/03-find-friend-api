import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { OrganizationNotFountError } from '@/use-cases/errors/organization-not-found-error';
import { makeCreatePetUseCase } from '@/use-cases/factories/make-create-pet-use-case';

const createBodySchema = z.object({
  name: z.string(),
  about: z.string(),
  age: z.string(),
  size: z.string(),
  energyLevel: z.string(),
  environment: z.string(),
});

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const body = createBodySchema.parse(request.body);
  const organizationId = request.user.sub;
  const createPetUseCase = makeCreatePetUseCase();

  try {
    await createPetUseCase.execute({
      ...body,
      organizationId,
    });

    return reply.status(201).send();
    /* v8 ignore next 7 */
  } catch (error) {
    if (error instanceof OrganizationNotFountError) {
      return reply.status(error.code).send({ message: error.message });
    }

    throw error;
  }
}
