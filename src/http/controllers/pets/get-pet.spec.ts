import { fakerPT_BR as faker } from '@faker-js/faker';
import supertest from 'supertest';

import { app } from '@/app';
import { prisma } from '@/lib/prisma';
import { Pet } from '@/repositories/pets-repository';
import { makeCreateOrganizationInput } from '@/utils/tests/factory/make-organization';
import { makeCreatePetInput } from '@/utils/tests/factory/make-pet';

describe('E2E: Get Pet', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to get a pet by id', async () => {
    const { email, password, organizationInput } =
      await makeCreateOrganizationInput();

    await supertest(app.server).post('/organizations').send(organizationInput);
    const authResponse = await supertest(app.server)
      .post('/organizations/auth')
      .send({
        email,
        password,
      });

    const { organizationId: _, ...data } =
      makeCreatePetInput<Record<string, string>>();

    await supertest(app.server)
      .post('/organizations/pets')
      .set('Authorization', `Bearer ${authResponse.body.token}`)
      .send(data);

    const pet = (await prisma.pet.findFirst()) as Pet;

    const response = await supertest(app.server)
      .get(`/organizations/pets/${pet.id}`)
      .set('Authorization', `Bearer ${authResponse.body.token}`);

    expect(response.statusCode).toEqual(200);
  });

  it('should not be able to get a pet with wrong id', async () => {
    const { email, password, organizationInput } =
      await makeCreateOrganizationInput();

    await supertest(app.server).post('/organizations').send(organizationInput);
    const authResponse = await supertest(app.server)
      .post('/organizations/auth')
      .send({
        email,
        password,
      });

    const response = await supertest(app.server)
      .get(`/organizations/pets/${faker.string.uuid()}`)
      .set('Authorization', `Bearer ${authResponse.body.token}`);

    expect(response.statusCode).toEqual(404);
  });
});
