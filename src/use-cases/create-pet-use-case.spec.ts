import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository';
import { InMemoryPetsRepository } from '@/repositories/in-memory/in-memory-pets-repository';
import type { OrganizationCreateInput } from '@/repositories/organizations-repository';
import { makeCreateOrganizationInput } from '@/tests/factory/make-organization';
import { makeCreatePetInput } from '@/tests/factory/make-pet';

import { CreatePetUseCase } from './create-pet-use-case';
import { OrganizationNotFountError } from './errors/organization-not-found-error';

let organizationsRepository: InMemoryOrganizationsRepository;
let petsRepository: InMemoryPetsRepository;
let sut: CreatePetUseCase;

let organizationInput: OrganizationCreateInput;

describe('CreatePetUseCase', () => {
  beforeEach(async () => {
    organizationsRepository = new InMemoryOrganizationsRepository();
    petsRepository = new InMemoryPetsRepository(organizationsRepository);
    sut = new CreatePetUseCase(petsRepository, organizationsRepository);

    const { organizationInput: orgInput, password_hash } =
      await makeCreateOrganizationInput();

    const { authorName: author_name, password: _, ...data } = orgInput;

    organizationInput = {
      ...data,
      author_name,
      password_hash,
    };
  });

  it('should be able to create a pet', async () => {
    const organization =
      await organizationsRepository.create(organizationInput);

    const petInput = makeCreatePetInput(organization.id);

    const response = await sut.execute(petInput);
    const {
      energyLevel: energy_level,
      organizationId: organization_id,
      ...rest
    } = petInput;
    const compare = {
      energy_level,
      organization_id,
      ...rest,
    };

    expect(response.data.id).toEqual(expect.any(String));
    expect(response.data).toEqual(expect.objectContaining(compare));
  });

  it('should not be able to create a pet with invalid organization', async () => {
    const petInput = makeCreatePetInput();

    await expect(sut.execute(petInput)).rejects.toBeInstanceOf(
      OrganizationNotFountError,
    );
  });
});
