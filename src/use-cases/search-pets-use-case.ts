import type { Pet, PetsRepository } from '@/repositories/pets-repository';

export interface SearchPetsUseCaseParams {
  city: string;
  age?: string;
  size?: string;
  energyLevel?: string;
  environment?: string;
}

export interface SearchPetsUseCaseResponse {
  data: Pet[];
}

export class SearchPetsUseCase {
  #petsRepository: PetsRepository;

  constructor(petsRepository: PetsRepository) {
    this.#petsRepository = petsRepository;
  }

  async execute({
    city,
    age,
    energyLevel: energy_level,
    environment,
    size,
  }: SearchPetsUseCaseParams): Promise<SearchPetsUseCaseResponse> {
    const pets = await this.#petsRepository.findAll({
      city,
      age,
      energy_level,
      environment,
      size,
    });

    return { data: pets };
  }
}
