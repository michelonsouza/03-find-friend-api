import { randomUUID } from 'node:crypto';

import { OrganizationsRepository } from '@/repositories/organizations-repository';
import type {
  FindAllParams,
  Pet,
  PetCreateInput,
  PetsRepository,
} from '@/repositories/pets-repository';

export class InMemoryPetsRepository implements PetsRepository {
  #pets: Pet[] = [];

  #organizationsRepository: OrganizationsRepository;

  constructor(organizationsRepository: OrganizationsRepository) {
    this.#organizationsRepository = organizationsRepository;
  }

  async findById(id: string): Promise<Pet | null> {
    const pet = this.#pets.find(pet => pet.id === id) ?? null;

    return Promise.resolve(pet);
  }

  async create(data: PetCreateInput): Promise<Pet> {
    const newPet = {
      ...data,
      id: randomUUID(),
      created_at: new Date().toISOString(),
    };

    this.#pets.push(newPet);

    return Promise.resolve(newPet);
  }

  async findAll({
    city,
    age,
    energy_level,
    environment,
    size,
  }: FindAllParams): Promise<Pet[]> {
    const orgsByCity = await this.#organizationsRepository.findByCity(city);
    const pets = this.#pets.filter(pet => {
      const comparisons = {
        organization_id: orgsByCity.some(org => org.id === pet.organization_id),
        age: age ? pet.age === age : true,
        environment: environment ? pet.environment === environment : true,
        size: size ? pet.size === size : true,
        energy_level: energy_level ? pet.energy_level === energy_level : true,
      };

      return Object.values(comparisons).every(Boolean);
    });

    return Promise.resolve(pets);
  }
}
