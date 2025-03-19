import { fakerPT_BR as faker } from '@faker-js/faker';
import supertest from 'supertest';

import { app } from '@/app';
import { makeCreateOrganizationInput } from '@/utils/tests/factory/make-organization';
import { makeCreatePetInput } from '@/utils/tests/factory/make-pet';

async function makeOrgAndPets(petsQTD = 1) {
  const { email, password, organizationInput } =
    await makeCreateOrganizationInput();
  await supertest(app.server).post('/organizations').send(organizationInput);
  const authResponse = await supertest(app.server)
    .post('/organizations/auth')
    .send({
      email,
      password,
    });

  const petsInputs = Array(petsQTD)
    .fill(null)
    .map(() => makeCreatePetInput<Record<string, string>>());

  await Promise.all(
    Array(petsQTD)
      .fill(null)
      .map((_null, index) => {
        const { organizationId: _, ...data } = petsInputs[index];

        return supertest(app.server)
          .post('/organizations/pets')
          .set('Authorization', `Bearer ${authResponse.body.token}`)
          .send(data);
      }),
  );

  return { token: authResponse.body.token, organizationInput, petsInputs };
}

let petsQuantity = 1;

describe('E2E: Search Pets', () => {
  beforeAll(async () => {
    await app.ready();
  });

  beforeEach(() => {
    petsQuantity = faker.number.int({ min: 1, max: 5 });
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able search pets by city', async () => {
    const { organizationInput } = await makeOrgAndPets(petsQuantity);

    const response = await supertest(app.server)
      .get('/organizations/pets')
      .query({
        city: organizationInput.city,
      });

    expect(response.status).toBe(200);
  });

  it('should not be able search pets without city', async () => {
    const response = await supertest(app.server).get('/organizations/pets');

    expect(response.status).toBe(400);
  });

  it('should be able search pets by city and age', async () => {
    const { organizationInput, petsInputs } =
      await makeOrgAndPets(petsQuantity);
    const [pet] = petsInputs;
    const parsedPet = {
      age: pet.age,
      energy_level: pet.energyLevel,
      environment: pet.environment,
      size: pet.size,
      about: pet.about,
    };

    const response = await supertest(app.server)
      .get('/organizations/pets')
      .query({
        city: organizationInput.city,
        age: pet.age,
      });

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(
      expect.arrayContaining([expect.objectContaining(parsedPet)]),
    );
  });

  it('should be able search pets by city and size', async () => {
    const { organizationInput, petsInputs } =
      await makeOrgAndPets(petsQuantity);
    const [pet] = petsInputs;
    const parsedPet = {
      age: pet.age,
      energy_level: pet.energyLevel,
      environment: pet.environment,
      size: pet.size,
      about: pet.about,
    };

    const response = await supertest(app.server)
      .get('/organizations/pets')
      .query({
        city: organizationInput.city,
        size: pet.size,
      });

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(
      expect.arrayContaining([expect.objectContaining(parsedPet)]),
    );
  });

  it('should be able search pets by city and energy level', async () => {
    const { organizationInput, petsInputs } =
      await makeOrgAndPets(petsQuantity);
    const [pet] = petsInputs;
    const parsedPet = {
      age: pet.age,
      energy_level: pet.energyLevel,
      environment: pet.environment,
      size: pet.size,
      about: pet.about,
    };

    const response = await supertest(app.server)
      .get('/organizations/pets')
      .query({
        city: organizationInput.city,
        energyLevel: pet.energyLevel,
      });

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(
      expect.arrayContaining([expect.objectContaining(parsedPet)]),
    );
  });

  it('should be able search pets by city and environment', async () => {
    const { organizationInput, petsInputs } =
      await makeOrgAndPets(petsQuantity);
    const [pet] = petsInputs;
    const parsedPet = {
      age: pet.age,
      energy_level: pet.energyLevel,
      environment: pet.environment,
      size: pet.size,
      about: pet.about,
    };

    const response = await supertest(app.server)
      .get('/organizations/pets')
      .query({
        city: organizationInput.city,
        environment: pet.environment,
      });

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(
      expect.arrayContaining([expect.objectContaining(parsedPet)]),
    );
  });

  it('should be able search pets by city and all filters', async () => {
    const { organizationInput, petsInputs } =
      await makeOrgAndPets(petsQuantity);
    const [pet] = petsInputs;
    const parsedPet = {
      age: pet.age,
      energy_level: pet.energyLevel,
      environment: pet.environment,
      size: pet.size,
      about: pet.about,
    };

    const response = await supertest(app.server)
      .get('/organizations/pets')
      .query({
        city: organizationInput.city,
        environment: pet.environment,
        age: pet.age,
        size: pet.size,
        energyLevel: pet.energyLevel,
      });

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(
      expect.arrayContaining([expect.objectContaining(parsedPet)]),
    );
  });
});
