import { PrismaPetsRepository } from '@/repositories/prisma/prisma-pets-repository';
import { SearchPetsUseCase } from '@/use-cases/search-pets-use-case';

export function makeSearchPetsUseCase(): SearchPetsUseCase {
  const petsRepository = new PrismaPetsRepository();

  const searchPetsUseCase = new SearchPetsUseCase(petsRepository);

  return searchPetsUseCase;
}
