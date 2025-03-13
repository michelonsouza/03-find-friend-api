import { PrismaOrganizationsRepository } from '@/repositories/prisma/prisma-organizations-repository';
import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository';
import { CreatePetUseCase } from '@/use-cases/create-pet-use-case';

export function makeCreatePetUseCase(): CreatePetUseCase {
  const petsRepository = new PrismaPetsRepository();
  const organizationsRepository = new PrismaOrganizationsRepository();

  const createPetUseCase = new CreatePetUseCase(
    petsRepository,
    organizationsRepository,
  );

  return createPetUseCase;
}
