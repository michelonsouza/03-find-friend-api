import supertest from 'supertest';

import { app } from '@/app';
import { makeCreateOrganizationInput } from '@/utils/tests/factory/make-organization';
import { makeCreatePetInput } from '@/utils/tests/factory/make-pet';

describe('E2E: Create Pet', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a new pet', async () => {
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

    const response = await supertest(app.server)
      .post('/organizations/pets')
      .set('Authorization', `Bearer ${authResponse.body.token}`)
      .send(data);

    expect(response.statusCode).toEqual(201);
  });

  it('should not be able to create a new pet when not authenticated', async () => {
    const { organizationInput } = await makeCreateOrganizationInput();

    await supertest(app.server).post('/organizations').send(organizationInput);

    const { organizationId: _, ...data } =
      makeCreatePetInput<Record<string, string>>();

    const response = await supertest(app.server)
      .post('/organizations/pets')
      .send(data);

    expect(response.statusCode).toEqual(401);
  });
});
