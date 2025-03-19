import { fakerPT_BR as faker } from '@faker-js/faker';
import supertest from 'supertest';

import { app } from '@/app';
import { makeCreateOrganizationInput } from '@/utils/tests/factory/make-organization';

describe('E2E: Authenticate Organization', () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be able to authenticate organization', async () => {
    const { organizationInput, password, email } =
      await makeCreateOrganizationInput();

    await supertest(app.server).post('/organizations').send(organizationInput);

    const response = await supertest(app.server)
      .post('/organizations/auth')
      .send({
        email,
        password,
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });

  it('should not be able to authenticate organization when e-mail or password is incorrect', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();

    const response = await supertest(app.server)
      .post('/organizations/auth')
      .send({
        email,
        password,
      });

    expect(response.statusCode).toEqual(401);
    expect(response.body).toEqual({
      message: 'E-mail or password is incorrect.',
    });
  });
});
