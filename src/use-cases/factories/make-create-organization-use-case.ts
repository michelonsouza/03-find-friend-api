import { PrismaOrganizationsRepository } from '@/repositories/prisma/prisma-organizations-repository';
import { CreateOrganizationUseCase } from '@/use-cases/create-organization-use-case';

export function makeCreateOrganizationUseCase(): CreateOrganizationUseCase {
  const organizationsRepository = new PrismaOrganizationsRepository();
  const createOrganizationUseCase = new CreateOrganizationUseCase(
    organizationsRepository,
  );

  return createOrganizationUseCase;
}
