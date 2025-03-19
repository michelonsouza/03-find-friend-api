import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { PetNotFountError } from '@/use-cases/errors/pet-not-found-error';
import { makeGetPetUseCase } from '@/use-cases/factories/make-get-pet-use-case';

const routeSchema = z.object({
  id: z.string(),
});

export async function getPet(request: FastifyRequest, reply: FastifyReply) {
  const { id } = routeSchema.parse(request.params);

  const getPetUseCase = makeGetPetUseCase();

  try {
    const data = await getPetUseCase.execute({ id });

    return reply.status(200).send(data);
  } catch (error) {
    if (error instanceof PetNotFountError) {
      return reply.status(error.code).send({ message: error.message });
      /* v8 ignore next 6 */
    }

    console.error(error);

    return reply.status(500).send({ message: 'Internal server error' });
  }
}
