import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { makeFetchNearbyOrganizationsUseCase } from '@/use-cases/factories/make-fetch-nearby-use-case';

const querySchema = z.object({
  latitude: z.coerce.number().refine(value => Math.abs(value) <= 90),
  longitude: z.coerce.number().refine(value => Math.abs(value) <= 180),
});

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const query = querySchema.parse(request.query);

  try {
    const fetchNearbyUseCase = makeFetchNearbyOrganizationsUseCase();
    const data = await fetchNearbyUseCase.execute({
      userLatitude: query.latitude,
      userLongitude: query.longitude,
    });

    return reply.status(200).send(data);
    /* v8 ignore next 5 */
  } catch (error) {
    console.error(error);

    return reply.status(500).send({ message: 'Internal server error' });
  }
}
