import { OrganizationsRepository } from '@/repositories/organizations-repository';
import type { Pet, PetsRepository } from '@/repositories/pets-repository';

import { OrganizationNotFountError } from './errors/organization-not-found-error';

interface CreatePetUseCaseParams {
  age: string;
  name: string;
  size: string;
  about: string;
  energyLevel: string;
  environment: string;
  organizationId: string;
}

interface CreatePetUseCaseResponse {
  data: Pet;
}

export class CreatePetUseCase {
  #petsRepository: PetsRepository;
  #organizationsRepository: OrganizationsRepository;

  constructor(
    petsRepository: PetsRepository,
    organizationsRepository: OrganizationsRepository,
  ) {
    this.#petsRepository = petsRepository;
    this.#organizationsRepository = organizationsRepository;
  }

  async execute({
    energyLevel: energy_level,
    organizationId: organization_id,
    ...data
  }: CreatePetUseCaseParams): Promise<CreatePetUseCaseResponse> {
    const organization =
      await this.#organizationsRepository.findById(organization_id);

    if (!organization) {
      throw new OrganizationNotFountError();
    }

    const pet = await this.#petsRepository.create({
      ...data,
      energy_level,
      organization_id,
    });

    return { data: pet };
  }
}
