import { fakerPT_BR as faker } from '@faker-js/faker';

import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository';
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository';
import type { OrganizationCreateInput } from '@/repositories/organizations-repository';
import { makeCreateOrganizationInput } from '@/utils/tests/factory/make-organization';
import { makeCreatePetInput } from '@/utils/tests/factory/make-pet';

import { CreatePetUseCaseParams } from './create-pet-use-case';
import { PetNotFountError } from './errors/pet-not-found-error';
import { GetPetUseCase } from './get-pet-use-case';

let organizationsRepository: InMemoryOrganizationsRepository;
let petsRepository: InMemoryPetsRepository;
let sut: GetPetUseCase;

let organizationInput: OrganizationCreateInput;

describe('CreatePetUseCase', () => {
  beforeEach(async () => {
    organizationsRepository = new InMemoryOrganizationsRepository();
    petsRepository = new InMemoryPetsRepository(organizationsRepository);
    sut = new GetPetUseCase(petsRepository);

    const { organizationInput: orgInput, password_hash } =
      await makeCreateOrganizationInput();

    const { authorName: author_name, password: _, ...data } = orgInput;

    organizationInput = {
      ...data,
      author_name,
      password_hash,
    };
  });

  it('should be able to find a pet by id', async () => {
    const organization =
      await organizationsRepository.create(organizationInput);

    const petsInputs = Array(faker.number.int({ min: 1, max: 10 }))
      .fill(organization.id)
      .map(() => {
        const {
          energyLevel: energy_level,
          organizationId: organization_id,
          ...data
        } = makeCreatePetInput<CreatePetUseCaseParams>(organization.id);

        return {
          energy_level,
          organization_id,
          ...data,
        };
      });

    const pets = await Promise.all(
      petsInputs.map(pet => petsRepository.create(pet)),
    );

    const [firstPet] = pets;

    const response = await sut.execute({ id: firstPet.id });

    expect(response.data).toEqual(firstPet);
  });

  it('should not be able to find a pet with wrong id', async () => {
    const id = faker.string.uuid();

    await expect(sut.execute({ id })).rejects.toBeInstanceOf(PetNotFountError);
  });
});
