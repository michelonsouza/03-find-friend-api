import { fakerPT_BR as faker } from '@faker-js/faker';
import { hash } from 'bcryptjs';

export async function makeCreateOrganizationInput(altEmail?: string) {
  const password = faker.internet.password({ length: 6 });
  const email = altEmail ?? faker.internet.email();
  const password_hash = await hash(password, 8);

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

  return { email, password, organizationInput, password_hash };
}
