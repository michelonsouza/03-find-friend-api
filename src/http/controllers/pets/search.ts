import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeSearchPetsUseCase } from '@/use-cases/factories/make-search-pets-use-case';

const querySchema = z.object({
  city: z.string().min(1),
  age: z.string().optional(),
  size: z.string().optional(),
  energyLevel: z.string().optional(),
  environment: z.string().optional(),
});

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const { city, age, size, energyLevel, environment } = querySchema.parse(
    request.query,
  );

  const searchPetsUseCase = makeSearchPetsUseCase();

  try {
    const data = await searchPetsUseCase.execute({
      city,
      age,
      size,
      energyLevel,
      environment,
    });

    return reply.status(200).send(data);
    /* v8 ignore next 6 */
  } catch (error) {
    console.error(error);

    return reply.status(500).send({ message: 'Internal server error' });
  }
}
