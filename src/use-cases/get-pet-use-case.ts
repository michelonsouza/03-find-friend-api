import type { Pet, PetsRepository } from '@/repositories/pets-repository';

import { PetNotFountError } from './errors/pet-not-found-error';

interface GetPetUseCaseParams {
  id: string;
}

interface GetPetUseCaseResponse {
  data: Pet;
}

export class GetPetUseCase {
  #petsRepository: PetsRepository;

  constructor(petsRepository: PetsRepository) {
    this.#petsRepository = petsRepository;
  }

  async execute({ id }: GetPetUseCaseParams): Promise<GetPetUseCaseResponse> {
    const pet = await this.#petsRepository.findById(id);

    if (!pet) {
      throw new PetNotFountError();
    }

    return { data: pet };
  }
}
