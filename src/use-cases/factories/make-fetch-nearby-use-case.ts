import { PrismaOrganizationsRepository } from '@/repositories/prisma/prisma-organizations-repository';
import { FetchNearbyOrganizationsUseCase } from '@/use-cases/fetch-nearby-organizations-use-case';

export function makeFetchNearbyOrganizationsUseCase(): FetchNearbyOrganizationsUseCase {
  const organizationsRepository = new PrismaOrganizationsRepository();
  const fetchNearbyOrganizationsUseCase = new FetchNearbyOrganizationsUseCase(
    organizationsRepository,
  );

  return fetchNearbyOrganizationsUseCase;
}
