import { fakerPT_BR as faker } from '@faker-js/faker';
import { hash } from 'bcryptjs';

import { InMemoryOrganizationsRepository } from '@/repositories/in-memory/in-memory-organizations-repository';

import { AuthenticateUseCase } from './authenticate-use-case';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';

let organizationsRepository: InMemoryOrganizationsRepository;
let sut: AuthenticateUseCase;

async function makeCreateOrganization() {
  const password = faker.internet.password({ length: 6 });
  const email = faker.internet.email();
  const password_hash = await hash(password, 8);

  const organizationInput = {
    email,
    password_hash,
    name: faker.company.name(),
    whatsapp: faker.phone.number(),
    author_name: faker.person.fullName(),
    street: faker.location.street(),
    neighborhood: faker.location.city(),
    zipcode: faker.location.zipCode(),
    city: faker.location.city(),
    state: faker.location.state(),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
  };

  const organization = await organizationsRepository.create(organizationInput);

  return { email, password, organizationInput, organization };
}

describe('AuthenticateUseCase', () => {
  beforeEach(() => {
    organizationsRepository = new InMemoryOrganizationsRepository();
    sut = new AuthenticateUseCase(organizationsRepository);
  });

  it('should be able to authenticate an organization', async () => {
    const { email, password, organizationInput } =
      await makeCreateOrganization();

    const response = await sut.execute({
      email,
      password,
    });

    expect(response.data).toEqual(expect.objectContaining(organizationInput));
  });

  it('should not be able to authenticate an organization with wrong email', async () => {
    const authenticateInput = {
      email: faker.internet.email(),
      password: faker.internet.password({ length: 6 }),
    };

    await expect(sut.execute(authenticateInput)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });

  it('should not be able to authenticate with wrong password', async () => {
    const { email } = await makeCreateOrganization();

    const authenticateInput = {
      email,
      password: faker.internet.password({ length: 6 }),
    };

    await expect(sut.execute(authenticateInput)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    );
  });
});
