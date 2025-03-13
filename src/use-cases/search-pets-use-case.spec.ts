import { fakerPT_BR as faker } from '@faker-js/faker';

import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository';
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository';
import type { OrganizationCreateInput } from '@/repositories/organizations-repository';
import { PetCreateInput } from '@/repositories/pets-repository';
import { makeCreateOrganizationInput } from '@/utils/tests/factory/make-organization';
import { makeCreatePetInput } from '@/utils/tests/factory/make-pet';

import { SearchPetsUseCase } from './search-pets-use-case';

let organizationsRepository: InMemoryOrganizationsRepository;
let petsRepository: InMemoryPetsRepository;
let sut: SearchPetsUseCase;

let organizationInput: OrganizationCreateInput;

describe('SearchPetsUseCase', () => {
  beforeEach(async () => {
    organizationsRepository = new InMemoryOrganizationsRepository();
    petsRepository = new InMemoryPetsRepository(organizationsRepository);
    sut = new SearchPetsUseCase(petsRepository);

    const { organizationInput: orgInput, password_hash } =
      await makeCreateOrganizationInput();

    const { authorName: author_name, password: _, ...data } = orgInput;

    organizationInput = {
      ...data,
      author_name,
      password_hash,
    };
  });

  it('should be able to search pets by city', async () => {
    const organization =
      await organizationsRepository.create(organizationInput);
    const organization2 = await organizationsRepository.create({
      ...organizationInput,
      city: faker.location.city(),
      email: faker.internet.email(),
    });

    const pets1 = await Promise.all(
      Array(faker.number.int({ min: 1, max: 10 }))
        .fill(null)
        .map(() =>
          petsRepository.create(
            makeCreatePetInput(organization.id, true) as PetCreateInput,
          ),
        ),
    );

    const pets2 = await Promise.all(
      Array(faker.number.int({ min: 1, max: 10 }))
        .fill(null)
        .map(() =>
          petsRepository.create(
            makeCreatePetInput(organization2.id, true) as PetCreateInput,
          ),
        ),
    );

    const response1 = await sut.execute({ city: organization.city });
    const response2 = await sut.execute({ city: organization2.city });

    expect(response1.data).toHaveLength(pets1.length);
    expect(response2.data).toHaveLength(pets2.length);
  });

  it('should be able to search pets by city and age', async () => {
    const organization =
      await organizationsRepository.create(organizationInput);

    const age1 = faker.number.int({ min: 1, max: 15 }).toString();
    const age2 = faker.number
      .int({ min: Number(age1) + 1, max: Number(age1) + 15 })
      .toString();

    const petInput1 = makeCreatePetInput(
      organization.id,
      true,
    ) as PetCreateInput;
    const petInput2 = makeCreatePetInput(
      organization.id,
      true,
    ) as PetCreateInput;

    await petsRepository.create({ ...petInput1, age: age1 });
    await petsRepository.create({ ...petInput2, age: age2 });

    const response = await sut.execute({ city: organization.city, age: age1 });

    expect(response.data).toHaveLength(1);
  });

  it('should be able to search pets by city and size', async () => {
    const organization =
      await organizationsRepository.create(organizationInput);

    const petInput1 = makeCreatePetInput(
      organization.id,
      true,
    ) as PetCreateInput;
    const petInput2 = makeCreatePetInput(
      organization.id,
      true,
    ) as PetCreateInput;
    const petInput3 = makeCreatePetInput(
      organization.id,
      true,
    ) as PetCreateInput;

    const sizeToSearch = faker.helpers.arrayElement([
      'small',
      'medium',
      'large',
    ]);

    await petsRepository.create({ ...petInput1, size: 'small' });
    await petsRepository.create({ ...petInput2, size: 'medium' });
    await petsRepository.create({ ...petInput3, size: 'large' });

    const response = await sut.execute({
      city: organization.city,
      size: sizeToSearch,
    });

    expect(response.data).toHaveLength(1);
  });

  it('should be able to search pets by city and energy_level', async () => {
    const organization =
      await organizationsRepository.create(organizationInput);

    const petInput1 = makeCreatePetInput(
      organization.id,
      true,
    ) as PetCreateInput;
    const petInput2 = makeCreatePetInput(
      organization.id,
      true,
    ) as PetCreateInput;
    const petInput3 = makeCreatePetInput(
      organization.id,
      true,
    ) as PetCreateInput;
    const petInput4 = makeCreatePetInput(
      organization.id,
      true,
    ) as PetCreateInput;
    const petInput5 = makeCreatePetInput(
      organization.id,
      true,
    ) as PetCreateInput;

    const energyLevelToSearch = faker.helpers.arrayElement([
      'very-low',
      'low',
      'normal',
      'medium',
      'high',
    ]);

    await petsRepository.create({ ...petInput1, energy_level: 'very-low' });
    await petsRepository.create({ ...petInput2, energy_level: 'low' });
    await petsRepository.create({ ...petInput3, energy_level: 'normal' });
    await petsRepository.create({ ...petInput4, energy_level: 'medium' });
    await petsRepository.create({ ...petInput5, energy_level: 'high' });

    const response = await sut.execute({
      city: organization.city,
      energyLevel: energyLevelToSearch,
    });

    expect(response.data).toHaveLength(1);
  });

  it('should be able to search pets by city and environment', async () => {
    const organization =
      await organizationsRepository.create(organizationInput);

    const petInput1 = makeCreatePetInput(
      organization.id,
      true,
    ) as PetCreateInput;
    const petInput2 = makeCreatePetInput(
      organization.id,
      true,
    ) as PetCreateInput;

    const environmentToSearch = faker.helpers.arrayElement([
      'indoor',
      'outdoor',
    ]);

    await petsRepository.create({ ...petInput1, environment: 'indoor' });
    await petsRepository.create({ ...petInput2, environment: 'outdoor' });

    const response = await sut.execute({
      city: organization.city,
      environment: environmentToSearch,
    });

    expect(response.data).toHaveLength(1);
  });
});
