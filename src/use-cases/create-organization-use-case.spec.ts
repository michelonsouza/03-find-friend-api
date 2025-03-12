import { fakerPT_BR as faker } from '@faker-js/faker';
import { compare } from 'bcryptjs';

import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository';

import { CreateOrganizationUseCase } from './create-organization-use-case';
import { OrganizationAlreadyExistsError } from './errors/organization-already-exists';

let organizationsRepository: InMemoryOrganizationsRepository;
let sut: CreateOrganizationUseCase;

function makeCreateOrganizationInput(altEmail?: string) {
  const password = faker.internet.password({ length: 6 });
  const email = altEmail ?? faker.internet.email();

  const organizationInput = {
    email,
    password,
    name: faker.company.name(),
    whatsapp: faker.phone.number({ style: 'national' }),
    authorName: faker.person.fullName(),
    street: faker.location.street(),
    neighborhood: faker.location.city(),
    zipcode: faker.location.zipCode(),
    city: faker.location.city(),
    state: faker.location.state(),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
  };

  return { email, password, organizationInput };
}

describe('CreateOrganizationUseCase', () => {
  beforeEach(() => {
    organizationsRepository = new InMemoryOrganizationsRepository();
    sut = new CreateOrganizationUseCase(organizationsRepository);
  });

  it('should be able to create an organization', async () => {
    const { organizationInput } = makeCreateOrganizationInput();

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
    const { organizationInput, password } = makeCreateOrganizationInput();

    const { data } = await sut.execute(organizationInput);

    const isPasswordCorrectlyHashed = await compare(
      password,
      data.password_hash,
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it('should not be able to create an organization with same email twice', async () => {
    const email = faker.internet.email();
    const { organizationInput } = makeCreateOrganizationInput(email);
    const { organizationInput: organizationInput2 } =
      makeCreateOrganizationInput(email);

    await sut.execute(organizationInput);

    await expect(sut.execute(organizationInput2)).rejects.toBeInstanceOf(
      OrganizationAlreadyExistsError,
    );
  });
});
