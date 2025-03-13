import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository';
import { GetPetUseCase } from '@/use-cases/get-pet-use-case';

export function makeGetPetUseCase(): GetPetUseCase {
  const petsRepository = new PrismaPetsRepository();

  const getPetUseCase = new GetPetUseCase(petsRepository);

  return getPetUseCase;
}
