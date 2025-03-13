import { fakerPT_BR as faker } from '@faker-js/faker';

export function makeCreatePetInput<ReturnType>(
  orgId?: string,
  convert?: boolean,
) {
  const petInput = {
    age: faker.number.int({ min: 1, max: 15 }).toString(),
    name: faker.animal.petName(),
    size: faker.helpers.arrayElement(['small', 'medium', 'large']),
    about: faker.lorem.paragraph(),
    [convert ? 'energy_level' : 'energyLevel']: faker.helpers.arrayElement([
      'very-low',
      'low',
      'normal',
      'medium',
      'high',
    ]),
    environment: faker.helpers.arrayElement(['indoor', 'outdoor']),
    [convert ? 'organization_id' : 'organizationId']:
      orgId ?? faker.string.uuid(),
  } as ReturnType;

  return petInput;
}
