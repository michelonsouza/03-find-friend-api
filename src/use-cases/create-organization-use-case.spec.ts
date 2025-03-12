import { fakerPT_BR as faker } from '@faker-js/faker';
import { compare } from 'bcryptjs';

import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository';
import { makeCreateOrganizationInput } from '@/utils/tests/factory/make-organization';

import { CreateOrganizationUseCase } from './create-organization-use-case';
import { OrganizationAlreadyExistsError } from './errors/organization-already-exists';

let organizationsRepository: InMemoryOrganizationsRepository;
let sut: CreateOrganizationUseCase;

describe('CreateOrganizationUseCase', () => {
  beforeEach(() => {
    organizationsRepository = new InMemoryOrganizationsRepository();
    sut = new CreateOrganizationUseCase(organizationsRepository);
  });

  it('should be able to create an organization', async () => {
    const { organizationInput } = await makeCreateOrganizationInput();

    const response = await sut.execute(organizationInput);

    const {
      password: _,
      authorName: author_name,
      ...compare
    } = organizationInput;

    expect(response.data).toEqual(
      expect.objectContaining({ ...compare, author_name }),
    );
  });

  it('should hash organization password upon registration', async () => {
    const { organizationInput, password } = await makeCreateOrganizationInput();

    const { data } = await sut.execute(organizationInput);

    const isPasswordCorrectlyHashed = await compare(
      password,
      data.password_hash,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to create an organization with same email twice', async () => {
    const email = faker.internet.email();
    const { organizationInput } = await makeCreateOrganizationInput(email);
    const { organizationInput: organizationInput2 } =
      await makeCreateOrganizationInput(email);

    await sut.execute(organizationInput);

    await expect(sut.execute(organizationInput2)).rejects.toBeInstanceOf(
      OrganizationAlreadyExistsError,
    );
  });
});
