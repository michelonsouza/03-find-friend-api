import supertest from 'supertest';

import { app } from '@/app';
import { makeCreateOrganizationInput } from '@/utils/tests/factory/make-organization';

describe('E2E: Create Organization', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to create a new organization', async () => {
    const { organizationInput } = await makeCreateOrganizationInput();

    const response = await supertest(app.server)
      .post('/organizations')
      .send(organizationInput);

    expect(response.statusCode).toEqual(201);
  });

  it('should not be able to register a new organization when existent e-mail', async () => {
    const { organizationInput } = await makeCreateOrganizationInput();

    await supertest(app.server).post('/organizations').send(organizationInput);

    const response = await supertest(app.server)
      .post('/organizations')
      .send(organizationInput);

    expect(response.statusCode).toEqual(409);
    expect(response.body).toEqual({
      message: 'Organization already exists.',
    });
  });
});
